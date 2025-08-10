export const InfoItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: any;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mt-0.5">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600 break-words">
        {value || "No disponible"}
      </p>
    </div>
  </div>
);
