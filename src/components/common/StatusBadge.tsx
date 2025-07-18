import React from 'react';
import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
  type: 'booking' | 'item';
  className?: string;
}

export function StatusBadge({ status, type, className = '' }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending customer':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'booked':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'allocated':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in progress':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'invoiced':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const colorClass = getStatusStyles(status);
  
  return (
    <Badge className={`${colorClass} border text-xs font-medium px-2 py-1 ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}