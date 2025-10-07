import React from "react";
import { Check, XCircle } from 'react-feather';

const OrderStatusTracker = ({ status }) => {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStepIndex = steps.findIndex(step => step.toLowerCase() === status);

  // Handle the cancelled state separately
  if (status === 'cancelled') {
    return (
      <div className="flex flex-col items-center sm:items-end">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full font-medium">
          <XCircle size={16} />
          <span>Order Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex >= index;
          const isCurrent = currentStepIndex === index;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-400'}
                    ${isCurrent ? 'animate-pulse' : ''}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : <span className="font-bold">{index + 1}</span>}
                </div>
                <p className={`mt-2 text-xs font-semibold ${isCompleted ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {step}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2">
                   <div className={`h-full rounded-full ${index < currentStepIndex ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;