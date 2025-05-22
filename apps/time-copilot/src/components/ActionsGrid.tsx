import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  IdentificationIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const actions = [
  {
    title: 'Request time off',
    description:
      'Submit a leave request for vacation, sick days, or other types of absences.',
    href: '/copilot',
    icon: ClockIcon,
    iconForeground: 'text-blue-700',
    iconBackground: 'bg-blue-50',
  },
  {
    title: 'View leave balances',
    description:
      'Check your available time off balances for different leave types.',
    href: '/copilot',
    icon: DocumentTextIcon,
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
  },
  {
    title: 'View calendar',
    description: 'See your scheduled leaves and team absences on the calendar.',
    href: '/copilot',
    icon: CalendarIcon,
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
  },
  {
    title: 'Team planning',
    description:
      'Coordinate time off with your team members and check team availability.',
    href: '/copilot',
    icon: UserGroupIcon,
    iconForeground: 'text-emerald-700',
    iconBackground: 'bg-emerald-50',
  },
  {
    title: 'Personal info',
    description: 'Update your personal information and leave preferences.',
    href: '/copilot',
    icon: IdentificationIcon,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  },
  {
    title: 'Help & Support',
    description: 'Get help with time management questions and policies.',
    href: '/copilot',
    icon: QuestionMarkCircleIcon,
    iconForeground: 'text-rose-700',
    iconBackground: 'bg-rose-50',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function ActionsGrid() {
  return (
    <div className="divide-y divide-blue-100 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-md sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0 border border-blue-100">
      {actions.map((action, actionIdx) => (
        <div
          key={action.title}
          className={classNames(
            actionIdx === 0
              ? 'rounded-tl-2xl rounded-tr-2xl sm:rounded-tr-none'
              : '',
            actionIdx === 1 ? 'sm:rounded-tr-2xl' : '',
            actionIdx === actions.length - 2 ? 'sm:rounded-bl-2xl' : '',
            actionIdx === actions.length - 1
              ? 'rounded-br-2xl rounded-bl-2xl sm:rounded-bl-none'
              : '',
            'group relative bg-white/80 p-6 hover:bg-blue-50/80 transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset'
          )}
        >
          <div>
            <span
              className={classNames(
                action.iconBackground,
                action.iconForeground,
                'inline-flex rounded-xl p-3 ring-4 ring-white'
              )}
            >
              <action.icon aria-hidden="true" className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-base font-semibold text-blue-900">
              <Link href={action.href} className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span aria-hidden="true" className="absolute inset-0" />
                {action.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-blue-700">{action.description}</p>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-6 right-6 text-blue-200 group-hover:text-blue-400 transition-colors duration-200"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
