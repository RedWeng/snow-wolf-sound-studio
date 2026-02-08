/**
 * Session Form Component
 * 
 * Reusable form for creating and editing sessions
 */

'use client';

import { useState, useEffect } from 'react';
import type { Session } from '@/lib/types/database';

interface SessionFormProps {
  initialData?: Partial<Session>;
  onSubmit: (data: Partial<Session>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function SessionForm({ initialData, onSubmit, onCancel, loading = false }: SessionFormProps) {
  const [formData, setFormData] = useState<Partial<Session>>({
    title_zh: '',
    title_en: '',
    theme_zh: '',
    theme_en: '',
    story_zh: '',
    story_en: '',
    description_zh: '',
    description_en: '',
    venue_zh: '',
    venue_en: '',
    date: '',
    day_of_week: '',
    time: '',
    duration_minutes: 90,
    capacity: 20,
    hidden_buffer: 0,
    price: 2800,
    age_min: 5,
    age_max: 12,
    image_url: '',
    video_url: '',
    status: 'active',
    tags: [],
    roles: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
  const [roleForm, setRoleForm] = useState({
    id: '',
    name_zh: '',
    name_en: '',
    image_url: '',
    capacity: 1,
    description_zh: '',
    description_en: '',
  });

  // Auto-calculate day of week when date changes
  useEffect(() => {
    if (formData.date) {
      const date = new Date(formData.date);
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      const dayOfWeek = days[date.getDay()];
      setFormData(prev => ({ ...prev, day_of_week: dayOfWeek }));
    }
  }, [formData.date]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.title_zh) newErrors.title_zh = '請輸入中文標題';
    if (!formData.title_en) newErrors.title_en = '請輸入英文標題';
    if (!formData.theme_zh) newErrors.theme_zh = '請輸入中文主題';
    if (!formData.theme_en) newErrors.theme_en = '請輸入英文主題';
    if (!formData.venue_zh) newErrors.venue_zh = '請輸入中文地點';
    if (!formData.venue_en) newErrors.venue_en = '請輸入英文地點';
    if (!formData.date) newErrors.date = '請選擇日期';
    if (!formData.time) newErrors.time = '請選擇時間';
    if (!formData.duration_minutes || formData.duration_minutes < 30) {
      newErrors.duration_minutes = '時長至少 30 分鐘';
    }
    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = '容量至少 1 人';
    }
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = '請輸入有效價格';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (field: keyof Session, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
    }));
  };

  // Role management functions
  const handleAddRole = () => {
    setShowRoleForm(true);
    setEditingRoleIndex(null);
    setRoleForm({
      id: `role-${Date.now()}`,
      name_zh: '',
      name_en: '',
      image_url: '',
      capacity: 1,
      description_zh: '',
      description_en: '',
    });
  };

  const handleEditRole = (index: number) => {
    const role = formData.roles![index];
    setShowRoleForm(true);
    setEditingRoleIndex(index);
    setRoleForm({
      id: role.id,
      name_zh: role.name_zh,
      name_en: role.name_en,
      image_url: role.image_url || '',
      capacity: role.capacity,
      description_zh: role.description_zh || '',
      description_en: role.description_en || '',
    });
  };

  const handleSaveRole = () => {
    if (!roleForm.name_zh || !roleForm.name_en) {
      alert('請輸入角色的中英文名稱');
      return;
    }

    const newRole = {
      id: roleForm.id,
      name_zh: roleForm.name_zh,
      name_en: roleForm.name_en,
      image_url: roleForm.image_url,
      capacity: roleForm.capacity,
      description_zh: roleForm.description_zh,
      description_en: roleForm.description_en,
    };

    if (editingRoleIndex !== null) {
      // Update existing role
      const updatedRoles = [...(formData.roles || [])];
      updatedRoles[editingRoleIndex] = newRole;
      setFormData(prev => ({ ...prev, roles: updatedRoles }));
    } else {
      // Add new role
      setFormData(prev => ({
        ...prev,
        roles: [...(prev.roles || []), newRole],
      }));
    }

    setShowRoleForm(false);
    setEditingRoleIndex(null);
  };

  const handleDeleteRole = (index: number) => {
    if (confirm('確定要刪除這個角色嗎？')) {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles?.filter((_, i) => i !== index) || [],
      }));
    }
  };

  const handleCancelRoleForm = () => {
    setShowRoleForm(false);
    setEditingRoleIndex(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">基本資訊</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title ZH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title_zh}
              onChange={(e) => handleChange('title_zh', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title_zh ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例如：雪狼男孩 · 天裂之痕"
            />
            {errors.title_zh && (
              <p className="mt-1 text-sm text-red-500">{errors.title_zh}</p>
            )}
          </div>

          {/* Title EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => handleChange('title_en', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title_en ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Snow Wolf Boy · Sky Rift"
            />
            {errors.title_en && (
              <p className="mt-1 text-sm text-red-500">{errors.title_en}</p>
            )}
          </div>

          {/* Theme ZH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文主題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.theme_zh}
              onChange={(e) => handleChange('theme_zh', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.theme_zh ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例如：動畫配音體驗"
            />
            {errors.theme_zh && (
              <p className="mt-1 text-sm text-red-500">{errors.theme_zh}</p>
            )}
          </div>

          {/* Theme EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文主題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.theme_en}
              onChange={(e) => handleChange('theme_en', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.theme_en ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Animation Voice Acting"
            />
            {errors.theme_en && (
              <p className="mt-1 text-sm text-red-500">{errors.theme_en}</p>
            )}
          </div>

          {/* Story ZH */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文故事簡介
            </label>
            <textarea
              value={formData.story_zh}
              onChange={(e) => handleChange('story_zh', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入課程故事背景..."
            />
          </div>

          {/* Story EN */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文故事簡介
            </label>
            <textarea
              value={formData.story_en}
              onChange={(e) => handleChange('story_en', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter story background..."
            />
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">時間安排</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Day of Week (auto-calculated) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              星期
            </label>
            <input
              type="text"
              value={formData.day_of_week}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="自動計算"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              時間 <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-500">{errors.time}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              時長（分鐘） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value))}
              min="30"
              max="600"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.duration_minutes ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.duration_minutes && (
              <p className="mt-1 text-sm text-red-500">{errors.duration_minutes}</p>
            )}
          </div>

          {/* Venue ZH */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文地點 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.venue_zh}
              onChange={(e) => handleChange('venue_zh', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.venue_zh ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例如：玉成錄音室"
            />
            {errors.venue_zh && (
              <p className="mt-1 text-sm text-red-500">{errors.venue_zh}</p>
            )}
          </div>

          {/* Venue EN */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文地點 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.venue_en}
              onChange={(e) => handleChange('venue_en', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.venue_en ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Yu Cheng Recording Studio"
            />
            {errors.venue_en && (
              <p className="mt-1 text-sm text-red-500">{errors.venue_en}</p>
            )}
          </div>
        </div>
      </div>

      {/* Capacity & Pricing Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">容量與價格</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              容量（人） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
              min="1"
              max="100"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.capacity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>
            )}
          </div>

          {/* Hidden Buffer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              隱藏緩衝
            </label>
            <input
              type="number"
              value={formData.hidden_buffer}
              onChange={(e) => handleChange('hidden_buffer', parseInt(e.target.value))}
              min="0"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">預留名額，不顯示給使用者</p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              價格（NT$） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', parseInt(e.target.value))}
              min="0"
              step="100"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              狀態
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'active' | 'completed' | 'cancelled')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">進行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        </div>
      </div>

      {/* Age Range Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">年齡範圍</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Min */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最小年齡
            </label>
            <input
              type="number"
              value={formData.age_min || ''}
              onChange={(e) => handleChange('age_min', parseInt(e.target.value))}
              min="0"
              max="99"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Age Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最大年齡
            </label>
            <input
              type="number"
              value={formData.age_max || ''}
              onChange={(e) => handleChange('age_max', parseInt(e.target.value))}
              min="0"
              max="99"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">媒體檔案</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              課程圖片
            </label>
            
            {/* 預覽圖片 */}
            {formData.image_url && (
              <div className="mb-3 relative group">
                <img
                  src={formData.image_url}
                  alt="課程圖片預覽"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleChange('image_url', '')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* 上傳按鈕 */}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('type', 'image');

                  try {
                    const response = await fetch('/api/upload', {
                      method: 'POST',
                      body: formData,
                    });

                    if (!response.ok) {
                      const error = await response.json();
                      alert(error.error || '上傳失敗');
                      return;
                    }

                    const data = await response.json();
                    handleChange('image_url', data.url);
                  } catch (error) {
                    console.error('Upload error:', error);
                    alert('上傳失敗');
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer text-center"
              >
                📁 選擇圖片上傳
              </label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => handleChange('image_url', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="或輸入圖片網址"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">支援 JPG, PNG, GIF, WebP，最大 5MB，建議尺寸：1200x800px</p>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              課程影片
            </label>
            
            {/* 預覽影片 */}
            {formData.video_url && (
              <div className="mb-3 relative group">
                <video
                  src={formData.video_url}
                  controls
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleChange('video_url', '')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* 上傳按鈕 */}
            <div className="flex gap-2">
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('type', 'video');

                  try {
                    const response = await fetch('/api/upload', {
                      method: 'POST',
                      body: formData,
                    });

                    if (!response.ok) {
                      const error = await response.json();
                      alert(error.error || '上傳失敗');
                      return;
                    }

                    const data = await response.json();
                    handleChange('video_url', data.url);
                  } catch (error) {
                    console.error('Upload error:', error);
                    alert('上傳失敗');
                  }
                }}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer text-center"
              >
                🎬 選擇影片上傳
              </label>
              <input
                type="url"
                value={formData.video_url || ''}
                onChange={(e) => handleChange('video_url', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="或輸入影片網址"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">支援 MP4, WebM, MOV，最大 50MB</p>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">標籤</h2>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入標籤後按 Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              新增
            </button>
          </div>

          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full"
                >
                  <span className="text-sm font-medium">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Roles Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">角色管理</h2>
            <p className="text-sm text-gray-500 mt-1">
              {formData.roles && formData.roles.length > 0 
                ? `已新增 ${formData.roles.length} 個角色` 
                : '尚未新增角色'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddRole}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            新增角色
          </button>
        </div>

        {/* Role List */}
        {formData.roles && formData.roles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formData.roles.map((role, index) => (
              <div
                key={index}
                className="group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-200"
              >
                {/* Role Image */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 overflow-hidden">
                  {role.image_url ? (
                    <img
                      src={role.image_url}
                      alt={role.name_zh}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  {/* Capacity Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-bold text-gray-700">{role.capacity} 人</span>
                  </div>
                </div>

                {/* Role Info */}
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{role.name_zh}</h3>
                  <p className="text-sm text-gray-600 mb-3 truncate">{role.name_en}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditRole(index)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      編輯
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(index)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 font-medium mb-2">尚未新增角色</p>
            <p className="text-sm text-gray-500">點擊上方「新增角色」按鈕開始建立角色</p>
          </div>
        )}

        {/* Role Form Modal */}
        {showRoleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {editingRoleIndex !== null ? '編輯角色' : '新增角色'}
                </h3>

                <div className="space-y-4">
                  {/* Role Name ZH */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      中文名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={roleForm.name_zh}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, name_zh: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：里特"
                    />
                  </div>

                  {/* Role Name EN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      英文名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={roleForm.name_en}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, name_en: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Litt"
                    />
                  </div>

                  {/* Role Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      角色圖片網址
                    </label>
                    <input
                      type="url"
                      value={roleForm.image_url}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/character.png"
                    />
                    {roleForm.image_url && (
                      <img
                        src={roleForm.image_url}
                        alt="預覽"
                        className="mt-2 w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Role Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      容量（人）
                    </label>
                    <input
                      type="number"
                      value={roleForm.capacity}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                      min="1"
                      max="20"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Role Description ZH */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      中文描述
                    </label>
                    <textarea
                      value={roleForm.description_zh}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, description_zh: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="角色描述..."
                    />
                  </div>

                  {/* Role Description EN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      英文描述
                    </label>
                    <textarea
                      value={roleForm.description_en}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, description_en: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Character description..."
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelRoleForm}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRole}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    儲存角色
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>儲存中...</span>
            </>
          ) : (
            <span>{initialData ? '更新課程' : '建立課程'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
