export const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'pending customer': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'booked': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'allocated': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'in progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    case 'rejected': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'invoiced': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getItemStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'booked': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'allocated': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'collected': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
    case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};