import { Menus } from '@/types/menu';

export const menuData: Menus[] = [
  {
    id: '0',
    title: '成单洞察可视化',
    index: '/dashboard',
    icon: 'Odometer',
  },
  {
    id: '1',
    title: '智能对话助手',
    index: '/system-saler',
    icon: 'HomeFilled',
  },
  {
    id: '1',
    title: '用户意向度看板',
    index: '/system-role',
    icon: 'Odometer',
  },
  //   {
  //     id: '1',
  //     title: '系统管理',
  //     index: '1',
  //     icon: 'HomeFilled',
  //     children: [
  //       {
  //         id: '11',
  //         pid: '1',
  //         index: '/system-user',
  //         title: '用户管理',
  //       },
  //       {
  //         id: '12',
  //         pid: '1',
  //         index: '/system-role',
  //         title: '角色管理',
  //       },
  //       {
  //         id: '13',
  //         pid: '1',
  //         index: '/system-menu',
  //         title: '菜单管理',
  //       },
  //     ],
  //   },
];
