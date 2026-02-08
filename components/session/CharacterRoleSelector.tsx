'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Session, CharacterRole } from '@/lib/types/database';
import { getSessionRoleAvailability, RoleAvailability } from '@/lib/api/role-availability';

export interface CharacterRoleSelectorProps {
  session: Session;
  selectedRoleId: string | null;
  onRoleSelect: (roleId: string) => void;
  language: 'zh' | 'en';
}

/**
 * Character role selection component
 * Displays character portraits in a responsive grid for role selection
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
export function CharacterRoleSelector({
  session,
  selectedRoleId,
  onRoleSelect,
  language,
}: CharacterRoleSelectorProps) {
  const [roleAvailability, setRoleAvailability] = useState<Map<string, RoleAvailability>>(new Map());
  const [loading, setLoading] = useState(true);

  // Fetch role availability
  useEffect(() => {
    async function fetchAvailability() {
      if (!session.roles || session.roles.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const availabilities = await getSessionRoleAvailability(session.id);
        const availabilityMap = new Map(
          availabilities.map((a) => [a.roleId, a])
        );
        setRoleAvailability(availabilityMap);
      } catch (error) {
        console.error('Failed to fetch role availability:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [session.id, session.roles]);

  if (!session.roles || session.roles.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center">
        {session.roles.map((role) => {
          const availability = roleAvailability.get(role.id);
          const isAvailable = availability ? availability.available > 0 : true;
          const isSelected = selectedRoleId === role.id;
          const isDisabled = !isAvailable;

          return (
            <CharacterRoleCard
              key={role.id}
              role={role}
              isSelected={isSelected}
              isDisabled={isDisabled}
              language={language}
              onClick={() => {
                if (!isDisabled) {
                  onRoleSelect(role.id);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

interface CharacterRoleCardProps {
  role: CharacterRole;
  isSelected: boolean;
  isDisabled: boolean;
  language: 'zh' | 'en';
  onClick: () => void;
}

function CharacterRoleCard({
  role,
  isSelected,
  isDisabled,
  language,
  onClick,
}: CharacterRoleCardProps) {
  const roleName = language === 'zh' ? role.name_zh : role.name_en;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative group flex flex-col items-center gap-3 p-4
        transition-all duration-300 ease-smooth
        focus:outline-none
        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={`${language === 'zh' ? '選擇角色' : 'Select character'} ${roleName}`}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
    >
      {/* Circular Avatar Container with Glass Effect */}
      <div className="relative">
        {/* Glow Effect */}
        {isSelected && !isDisabled && (
          <div className="absolute inset-0 rounded-full bg-accent-aurora blur-xl opacity-60 animate-pulse scale-110" />
        )}
        
        {/* Avatar Circle */}
        <div
          className={`
            relative w-24 h-24 rounded-full overflow-hidden
            transition-all duration-300
            ${
              isSelected && !isDisabled
                ? 'ring-4 ring-accent-aurora shadow-[0_0_30px_rgba(139,233,253,0.5)] scale-110'
                : 'ring-2 ring-white/30'
            }
            ${!isDisabled && 'hover:ring-accent-moon hover:scale-105 hover:shadow-[0_0_20px_rgba(139,233,253,0.3)]'}
            ${isDisabled && 'grayscale'}
          `}
        >
          {/* Character Image */}
          <Image
            src={role.image_url}
            alt={roleName}
            fill
            className="object-cover object-top"
            sizes="96px"
          />
          
          {/* Overlay for disabled state */}
          {isDisabled && (
            <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="text-white font-bold text-xs bg-brand-navy/80 px-2 py-1 rounded-full">
                {language === 'zh' ? '已滿' : 'Full'}
              </span>
            </div>
          )}

          {/* Selection Checkmark - Top Right Corner */}
          {isSelected && !isDisabled && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-accent-aurora border-2 border-white rounded-full p-1 shadow-lg">
                <svg
                  className="w-4 h-4 text-brand-navy"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Shine Effect on Hover */}
          {!isDisabled && !isSelected && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-[-100%] group-hover:translate-x-[100%] transform" />
          )}
        </div>
      </div>

      {/* Character Name with Glass Effect */}
      <div
        className={`
          px-4 py-2 rounded-full text-center font-bold text-sm
          backdrop-blur-md border transition-all duration-300
          ${
            isSelected && !isDisabled
              ? 'bg-accent-aurora/90 text-brand-navy border-accent-aurora shadow-lg'
              : 'bg-white/10 text-white border-white/30'
          }
          ${!isDisabled && !isSelected && 'group-hover:bg-white/20 group-hover:border-accent-moon/50'}
        `}
      >
        {roleName}
      </div>
    </button>
  );
}
