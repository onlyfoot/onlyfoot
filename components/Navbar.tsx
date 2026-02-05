<div className="flex items-center justify-between h-28"> 
  {/* altura reduzida da navbar */}
  <Link to="/" className="flex items-center">
    <img 
      src={logo} 
      alt="Onlyfoot Logo"
      className="h-20 w-auto" // logo pela metade
    />
  </Link>

  {/* Profile & Logout */}
  <div className="flex items-center gap-6">
    {/* Profile */}
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-white">{user?.name}</p>
        <p className="text-xs text-zinc-500">Membro</p>
      </div>
      <div className="w-14 h-14 bg-zinc-700 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all">
        <img 
          src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
          alt="Profile" 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
    
    {/* Logout */}
    <button 
      onClick={logout}
      className="p-4 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
      title="Sair"
    >
      <LogOut className="h-8 w-8" />
    </button>
  </div>
</div>
