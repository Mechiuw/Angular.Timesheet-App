import { MenuItem } from '../models/menu.model';
import { Roles } from './roles';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Dashboard',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          role: [Roles.ADMIN, Roles.USER, Roles.MANAGER, Roles.BENEFIT],
        },
      ],
    },
    {
      group: 'Master',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Users',
          route: '/users',
          role: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Works',
          route: '/works',
          role: [Roles.ADMIN],
        },
      ],
    },
    {
      group: 'Timesheet',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/queue-list.svg',
          label: 'Timesheets',
          route: '/timesheets',
          role: [Roles.USER, Roles.MANAGER],
          children: [
            {
              label: 'Create',
              route: '/timesheets/create',
              role: [Roles.USER, Roles.MANAGER],
            },
            {
              label: 'List',
              route: '/timesheets/list',
              role: [Roles.USER, Roles.MANAGER,],
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/document-check.svg',
          label: 'Approvals',
          route: '/approvals',
          role: [Roles.ADMIN, Roles.USER, Roles.MANAGER, Roles.BENEFIT],
          children: [
            {
              label: 'On Progress',
              route: '/approvals/on-progress',
              role: [Roles.ADMIN, Roles.USER, Roles.MANAGER, Roles.BENEFIT],
            },
            {
              label: 'History',
              route: '/approvals/history',
              role: [Roles.ADMIN, Roles.USER, Roles.MANAGER, Roles.BENEFIT],
            },
          ],
        },
      ],
    },
  ];
}
