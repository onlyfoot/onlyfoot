import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../services/db';
import { Report, User } from '../types';
import { Shield, CheckCircle, XCircle, AlertTriangle, User as UserIcon, FileText, Loader2, UserCheck } from 'lucide-react';
import { Button } from '../components/Button';

export const Admin: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [kycRequests, setKycRequests] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'kyc'>('reports');
  const [filter, setFilter] = useState<'pending' | 'resolved' | 'dismissed'>('pending');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    if (activeTab === 'reports') {
      const data = await db.getReports();
      setReports(data);
    } else {
      const data = await db.getKYCRequests();
      setKycRequests(data);
    }
    setIsLoading(false);
  };

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    await db.resolveReport(reportId, action);
    loadData();
  };

  const handleKYCAction = async (userId: string, status: 'verified' | 'rejected') => {
    await db.processKYC(userId, status);
    loadData();
  };

  const filteredReports = reports.filter(r => r.status === filter);

  return (
    <Layout>
      <div className="p-4 md:p-6 min-h-screen pb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'reports' ? 'bg-brand-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
            }`}
          >
            Denúncias
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'kyc' ? 'bg-brand-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
            }`}
          >
            Solicitações KYC
          </button>
        </div>

        {activeTab === 'reports' && (
          <>
            <div className="flex gap-4 border-b border-dark-700 mb-6">
              {(['pending', 'resolved', 'dismissed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`pb-3 text-sm font-medium capitalize transition-colors ${
                    filter === status 
                      ? 'text-brand-500 border-b-2 border-brand-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {status === 'pending' ? 'Pendente' : status === 'resolved' ? 'Resolvido' : 'Dispensado'} ({reports.filter(r => r.status === status).length})
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div key={report.id} className="bg-dark-800 border border-dark-700 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            report.targetType === 'user' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {report.targetType === 'user' ? 'Usuário' : 'Post'}
                          </span>
                          <span className="text-xs text-gray-500">{report.timestamp}</span>
                        </div>
                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleReportAction(report.id, 'dismiss')}
                              className="p-1 hover:bg-dark-700 rounded text-gray-400 hover:text-white"
                              title="Dispensar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleReportAction(report.id, 'resolve')}
                              className="p-1 hover:bg-dark-700 rounded text-green-500 hover:text-green-400"
                              title="Resolver (Banir/Remover)"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <div className="mt-1">
                          {report.targetType === 'user' ? <UserIcon className="w-5 h-5 text-gray-400" /> : <FileText className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">ID Alvo: {report.targetId}</p>
                          <p className="text-sm text-gray-400">Denunciado por: {report.reporterId}</p>
                        </div>
                      </div>

                      <div className="bg-dark-900/50 p-3 rounded-lg border border-dark-700 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Motivo</p>
                          <p className="text-sm text-white">{report.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhuma denúncia {filter === 'pending' ? 'pendente' : filter === 'resolved' ? 'resolvida' : 'dispensada'} encontrada.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : kycRequests.length > 0 ? (
              kycRequests.map((user) => (
                <div key={user.id} className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-white">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">Verificação Pendente</span>
                        <a href="#" className="text-xs text-brand-500 hover:underline">Ver Documentos</a>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                      onClick={() => handleKYCAction(user.id, 'rejected')}
                    >
                      Rejeitar
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleKYCAction(user.id, 'verified')}
                    >
                      Aprovar
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhuma solicitação KYC pendente.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};