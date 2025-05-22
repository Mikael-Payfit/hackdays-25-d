import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const actions = [
  {
    title: 'Request time off',
    href: '/copilot',
    icon: ClockIcon,
    iconForeground: 'text-blue-700',
    iconBackground: 'bg-blue-50',
  },
  {
    title: 'View leave balances',
    href: '/copilot',
    icon: DocumentTextIcon,
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
  },
  {
    title: 'Review pending requests',
    href: '/copilot',
    icon: CalendarIcon,
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
  },
  {
    title: 'Team planning',
    href: '/copilot',
    icon: UserGroupIcon,
    iconForeground: 'text-emerald-700',
    iconBackground: 'bg-emerald-50',
  },
];

export function ActionsGrid() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-md border border-blue-100">
      <div className="flex flex-col divide-y divide-blue-100">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="flex items-center justify-between px-4 py-3 hover:bg-blue-50/80 transition-colors duration-200"
          >
            <div className="flex items-center">
              <span
                className={`inline-flex rounded-lg p-2 ${action.iconBackground} ${action.iconForeground} mr-3`}
              >
                <action.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-base font-medium text-blue-900">
                {action.title}
              </span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-blue-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
