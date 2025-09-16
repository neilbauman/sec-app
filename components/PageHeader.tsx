interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b pb-4 mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
  );
}
