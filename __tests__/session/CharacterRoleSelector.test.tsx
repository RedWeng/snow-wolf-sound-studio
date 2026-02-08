/**
 * Unit tests for CharacterRoleSelector component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CharacterRoleSelector } from '@/components/session/CharacterRoleSelector';
import { Session } from '@/lib/types/database';
import * as roleAvailabilityApi from '@/lib/api/role-availability';

// Mock the role availability API
jest.mock('@/lib/api/role-availability');

const mockSession: Session = {
  id: '2',
  title_zh: '卡達爾之戰',
  title_en: 'Battle of Kadal',
  theme_zh: '動畫配音',
  theme_en: 'Animation Voice Acting',
  description_zh: '測試描述',
  description_en: 'Test description',
  date: '2026-05-17',
  time: '13:00',
  duration_minutes: 135,
  capacity: 10,
  hidden_buffer: 4,
  price: 3200,
  age_min: 8,
  age_max: 12,
  image_url: '/test.png',
  status: 'active',
  roles: [
    {
      id: 'aileen',
      name_zh: '艾琳',
      name_en: 'Aileen',
      image_url: '/full/aileen-full.png',
      capacity: 4,
    },
    {
      id: 'litt',
      name_zh: '里特',
      name_en: 'Litt',
      image_url: '/full/Litt-full.png',
      capacity: 4,
    },
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe('CharacterRoleSelector', () => {
  beforeEach(() => {
    // Mock the API to return availability
    (roleAvailabilityApi.getSessionRoleAvailability as jest.Mock).mockResolvedValue([
      { roleId: 'aileen', capacity: 4, assigned: 0, available: 4 },
      { roleId: 'litt', capacity: 4, assigned: 0, available: 4 },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all character roles', async () => {
    const onRoleSelect = jest.fn();
    
    render(
      <CharacterRoleSelector
        session={mockSession}
        selectedRoleId={null}
        onRoleSelect={onRoleSelect}
        language="zh"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('艾琳')).toBeInTheDocument();
      expect(screen.getByText('里特')).toBeInTheDocument();
    });
  });

  it('should display role names in English when language is en', async () => {
    const onRoleSelect = jest.fn();
    
    render(
      <CharacterRoleSelector
        session={mockSession}
        selectedRoleId={null}
        onRoleSelect={onRoleSelect}
        language="en"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Aileen')).toBeInTheDocument();
      expect(screen.getByText('Litt')).toBeInTheDocument();
    });
  });

  it('should call onRoleSelect when a role is clicked', async () => {
    const onRoleSelect = jest.fn();
    
    render(
      <CharacterRoleSelector
        session={mockSession}
        selectedRoleId={null}
        onRoleSelect={onRoleSelect}
        language="zh"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('艾琳')).toBeInTheDocument();
    });

    const aileenButton = screen.getByText('艾琳').closest('button');
    if (aileenButton) {
      fireEvent.click(aileenButton);
    }

    expect(onRoleSelect).toHaveBeenCalledWith('aileen');
  });

  it('should show disabled state for roles with no availability', async () => {
    // Mock one role as full
    (roleAvailabilityApi.getSessionRoleAvailability as jest.Mock).mockResolvedValue([
      { roleId: 'aileen', capacity: 4, assigned: 4, available: 0 },
      { roleId: 'litt', capacity: 4, assigned: 0, available: 4 },
    ]);

    const onRoleSelect = jest.fn();
    
    render(
      <CharacterRoleSelector
        session={mockSession}
        selectedRoleId={null}
        onRoleSelect={onRoleSelect}
        language="zh"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('已額滿')).toBeInTheDocument();
    });

    const aileenButton = screen.getByText('艾琳').closest('button');
    expect(aileenButton).toBeDisabled();
  });

  it('should not render when session has no roles', () => {
    const sessionWithoutRoles = { ...mockSession, roles: undefined };
    const onRoleSelect = jest.fn();
    
    const { container } = render(
      <CharacterRoleSelector
        session={sessionWithoutRoles}
        selectedRoleId={null}
        onRoleSelect={onRoleSelect}
        language="zh"
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
