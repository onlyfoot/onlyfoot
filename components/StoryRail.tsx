import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Story, Creator } from '../types';
import { CREATORS, CURRENT_USER } from '../constants';
import { Plus, Loader2 } from 'lucide-react';

export const StoryRail: React.FC = () => {
  const [stories, setStories] = useState<{ story: Story, creator: Creator | typeof CURRENT_USER }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    const data = await db.getStories();
    const mapped = data.map(story => {
      if (story.creatorId === CURRENT_USER.id) {
        return { story, creator: CURRENT_USER };
      }
      const creator = CREATORS.find(c => c.id === story.creatorId);
      return creator ? { story, creator } : null;
    }).filter(item => item !== null) as { story: Story, creator: Creator | typeof CURRENT_USER }[];
    setStories(mapped);
  };

  const handleAddStory = async () => {
    setIsUploading(true);
    try {
      // Mock upload
      const randomId = Math.floor(Math.random() * 1000);
      const mockUrl = `https://picsum.photos/id/${randomId}/400/800`;
      await db.addStory(mockUrl);
      await loadStories();
    } catch (error) {
      console.error("Falha ao adicionar story", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-4 md:px-0">
      {/* Add Story Button */}
      <div 
        onClick={handleAddStory}
        className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer group"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dark-700 p-1 relative group-hover:border-brand-500 transition-colors">
          <div className="w-full h-full bg-dark-800 rounded-full flex items-center justify-center overflow-hidden">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            ) : (
              <img src={CURRENT_USER.avatar} alt="Eu" className="w-full h-full object-cover opacity-50" />
            )}
            {!isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-brand-500 rounded-full p-0.5 border-2 border-dark-900">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        <span className="text-xs text-gray-400 truncate w-full text-center">Adicionar Story</span>
      </div>

      {/* Stories List */}
      {stories.map(({ story, creator }) => (
        <div key={story.id} className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer">
          <div className={`w-16 h-16 rounded-full p-[2px] ${story.isViewed ? 'bg-dark-700' : 'bg-gradient-to-tr from-yellow-400 to-brand-600'}`}>
            <div className="w-full h-full rounded-full border-2 border-dark-900 overflow-hidden">
              <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-xs text-gray-300 truncate w-16 text-center">{creator.name.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  );
};