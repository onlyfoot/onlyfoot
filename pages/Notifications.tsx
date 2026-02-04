import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../services/db';
import { Notification } from '../types';
import { Heart, MessageCircle, DollarSign, UserPlus, Check, Loader2 } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await db.getNotifications();
      setNotifications(data);
      setIsLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    setIsMarking(true);
    await db.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setIsMarking(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-brand-500 fill-brand-500" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500 fill-blue-500" />;
      case 'tip': return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'subscribe': return <UserPlus className="w-5 h-5 text-purple-500" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <button 
            onClick={handleMarkAllRead}
            disabled={isMarking}
            className="text-sm text-brand-500 hover:text-brand-400 font-medium flex items-center gap-1 disabled:opacity-50"
          >
            {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Mark all as read
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-dark-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  notification.isRead 
                    ? 'bg-dark-900 border-transparent' 
                    : 'bg-dark-800 border-dark-700'
                }`}
              >
                <div className="relative">
                  <img 
                    src={notification.actorAvatar} 
                    alt={notification.actorName} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-dark-900 rounded-full p-1">
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-white">
                    <span className="font-bold hover:underline cursor-pointer">{notification.actorName}</span>
                    {' '}
                    <span className="text-gray-300">{notification.content}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-brand-500 rounded-full mt-3"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};