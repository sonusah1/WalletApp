import React from 'react';

const Card = ({
  children,
  title,
  subTitle,
  className = '',
  titleClassName = '',
  subTitleClassName = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {(title || subTitle) && (
        <div className="p-5 border-b border-gray-200">
          {title && (
            <h3 className={`text-lg font-medium text-gray-900 ${titleClassName}`}>
              {title}
            </h3>
          )}
          {subTitle && (
            <p className={`mt-1 text-sm text-gray-500 ${subTitleClassName}`}>
              {subTitle}
            </p>
          )}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
