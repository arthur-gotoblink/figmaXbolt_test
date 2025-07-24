import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Package, MessageSquare } from 'lucide-react';
import { StatusBadge } from './common/StatusBadge';
import { DeliveryInfo } from './booking/DeliveryInfo';
import { VehicleInfo } from './booking/VehicleInfo';
import { BookingSummary } from './booking/BookingSummary';
import { Comments } from './booking/Comments';
import { SettingsMenu } from './SettingsMenu';
import { useSettings } from './SettingsContext';
import { Booking } from '../types/booking';

interface BookingDetailsProps {
  booking: Booking;
  onBack: () => void;
  onQuickAllocate: (booking: Booking) => void;
  onReplyToJob: (booking: Booking) => void;
  onAddComment: (bookingId: string, comment: string) => void;
  onEditComment: (bookingId: string, commentId: string, newMessage: string) => void;
  onRemoveComment: (bookingId: string, commentId: string) => void;
  username: string;
  onLogout: () => void;
}

export function BookingDetails({ 
  booking, 
  onBack, 
  onQuickAllocate,
  onReplyToJob, 
  onAddComment, 
  onEditComment, 
  onRemoveComment, 
  username,
  onLogout 
}: BookingDetailsProps) {
  const { getTextSizeClasses } = useSettings();
  const { token } = useAuth();
  const textClasses = getTextSizeClasses();

  const handleAddComment = async (comment: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${booking.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: comment,
          booking_id: booking.id
        }),
      });

      if (response.ok) {
        // Refresh the page or trigger a re-fetch of comments
        window.location.reload();
      } else {
        console.error('Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
    
    // Fallback to the original handler
    onAddComment(booking.id, comment);
  };

  const handleEditComment = (commentId: string, newMessage: string) => {
    onEditComment(booking.id, commentId, newMessage);
  };

  const handleRemoveComment = (commentId: string) => {
    onRemoveComment(booking.id, commentId);
  };

  // Determine which action button to show based on booking status
  const renderActionButton = () => {
    if (booking.status === 'pending') {
      return (
        <Button 
          onClick={() => onReplyToJob(booking)}
          className={`${textClasses.base} w-full bg-blue-600 hover:bg-blue-700 text-white h-12 touch-manipulation`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Reply to Job
        </Button>
      );
    }

    if (booking.status === 'booked') {
      return (
        <Button 
          onClick={() => onQuickAllocate(booking)}
          className={`${textClasses.base} w-full bg-green-600 hover:bg-green-700 text-white h-12 touch-manipulation`}
        >
          <Package className="h-5 w-5 mr-2" />
          Quick Allocate
        </Button>
      );
    }

    // For other statuses, don't show an action button
    return null;
  };

  const actionButton = renderActionButton();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center min-w-0">
              <Button variant="ghost" onClick={onBack} className={`mr-3 text-slate-600 hover:text-slate-900 p-2 touch-manipulation`}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className={`${textClasses.base} text-slate-900 truncate`}>{booking.reservationId}</h1>
                <p className={`${textClasses.small} text-slate-600 truncate`}>{booking.customer}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge status={booking.status} type="booking" />
              <SettingsMenu username={username} onLogout={onLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Action Button - Mobile First */}
          {actionButton && (
            <Card className="border-slate-200 bg-white sm:hidden">
              <CardContent className="p-4">
                {actionButton}
              </CardContent>
            </Card>
          )}

          <DeliveryInfo booking={booking} />
          <VehicleInfo booking={booking} />
          <BookingSummary booking={booking} />
          <Comments 
            comments={booking.comments} 
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onRemoveComment={handleRemoveComment}
            username={username} 
          />

          {/* Action Button - Desktop */}
          {actionButton && (
            <Card className="border-slate-200 bg-white hidden sm:block">
              <CardContent className="p-6">
                {actionButton}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}