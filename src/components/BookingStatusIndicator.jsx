import React from 'react';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

/**
 * Component to display booking status indicators with different icons
 * @param {Object} props
 * @param {string} props.status - The booking status ("confirmed", "pending", "cancelled", "advance_paid", "advance_pending")
 * @param {string} props.size - Size of the indicator ("sm", "md", "lg")
 * @param {boolean} props.showLabel - Whether to show the status label
 */
const BookingStatusIndicator = ({ status, size = 'md', showLabel = true }) => {
  // Define size classes
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  // Define status configurations
  const statusConfig = {
    confirmed: {
      icon: <FaCheckCircle className={`${sizeClasses[size]} text-green-500`} />,
      label: 'Confirmed',
      bgColor: 'bg-green-900',
      textColor: 'text-green-200'
    },
    pending: {
      icon: <FaHourglassHalf className={`${sizeClasses[size]} text-yellow-500`} />,
      label: 'Pending',
      bgColor: 'bg-yellow-900',
      textColor: 'text-yellow-200'
    },
    cancelled: {
      icon: <FaTimesCircle className={`${sizeClasses[size]} text-red-500`} />,
      label: 'Cancelled',
      bgColor: 'bg-red-900',
      textColor: 'text-red-200'
    },
    advance_paid: {
      icon: <FaCheckCircle className={`${sizeClasses[size]} text-blue-500`} />,
      label: 'Advance Paid',
      bgColor: 'bg-blue-900',
      textColor: 'text-blue-200'
    },
    advance_pending: {
      icon: <FaHourglassHalf className={`${sizeClasses[size]} text-orange-500`} />,
      label: 'Advance Pending',
      bgColor: 'bg-orange-900',
      textColor: 'text-orange-200'
    }
  };

  // Default to pending if status is not recognized
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <div className="flex items-center">
      <span className="mr-1">{config.icon}</span>
      {showLabel && (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default BookingStatusIndicator;