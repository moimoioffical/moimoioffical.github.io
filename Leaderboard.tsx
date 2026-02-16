
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as userService from '../services/userService';

interface LeaderboardProps {
  currentUser: User;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const allUsers = userService.getAllUsers();
    const sortedUsers = allUsers.sort((a, b) => b.progress.xp - a.progress.xp);
    setUsers(sortedUsers);
  }, []);

  const rankIcons = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-b-8 border-slate-200 shadow-2xl animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">🏆</div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Global Leaderboard</h2>
          <p className="text-slate-500 font-bold">See how you rank against other Nalibo learners!</p>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => {
          const isCurrentUser = user.username === currentUser.username;
          return (
            <div 
              key={user.username} 
              className={`flex items-center p-4 rounded-2xl transition-all ${
                isCurrentUser 
                  ? 'bg-blue-50 border-2 border-blue-200 shadow-lg scale-105' 
                  : 'bg-slate-50 border-2 border-slate-100'
              }`}
            >
              <div className="w-10 text-xl font-black text-center text-slate-400">
                {index < 3 ? rankIcons[index] : index + 1}
              </div>
              <div className="flex-1 ml-4">
                <p className={`font-black ${isCurrentUser ? 'text-blue-700' : 'text-slate-700'}`}>{user.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.progress.proficiencyLevel}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-slate-700">{user.progress.xp}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">XP</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
