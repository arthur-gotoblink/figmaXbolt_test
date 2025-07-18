import React from 'react';
import { Badge } from '../ui/badge';
import { getBookingStatusColor, getItemStatusColor } from '../../utils/statusColors';

interface StatusBadgeProps {
  status: string;
  type: 'booking' | 'item';
  className?: string;
}

export function StatusBadge({ status, type, className = '' }: StatusBadgeProps) {
  const colorClass = type === 'booking' ? getBookingStatusColor(status) : getItemStatusColor(status);
  
  return (
    <Badge className={`${colorClass} border text-xs ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}