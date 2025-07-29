import React from 'react';
import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
  type: 'booking' | 'item';
  className?: string;
}

export function StatusBadge({ status, type, className = '' }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    // Handle undefined/null status
    const statusLower = (status || 'unknown').toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending customer':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'booked':
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'allocated':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'in progress':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'rejected':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'invoiced':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const colorClass = getStatusStyles(status);
  
  return (
    <Badge className={`${colorClass} border text-xs font-medium px-3 py-1 rounded-full ${className}`}>
      {(status || 'Unknown').charAt(0).toUpperCase() + (status || 'Unknown').slice(1)}
    </Badge>
  );
}