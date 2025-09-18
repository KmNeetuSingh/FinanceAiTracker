import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const SummaryCards = ({ data }) => {
  const cards = [
    {
      title: 'Total Income',
      value: `₹${data?.totalIncome?.toLocaleString() || 0}`,
      icon: ArrowUpIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Expenses',
      value: `₹${data?.totalExpenses?.toLocaleString() || 0}`,
      icon: ArrowDownIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Net Balance',
      value: `₹${data?.netBalance?.toLocaleString() || 0}`,
      icon: CurrencyDollarIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;