import { Link, NavLink } from 'react-router-dom';

export interface MenuBarProps {
  menus: MenuEntry[];
}

export interface MenuEntry {
  url: string;
  name: string;
  icon: any;
}

export default function MenuBar(props: MenuBarProps) {
  return (
    <div className='flex md:flex-col bg-slate-200 center dark:bg-slate-800 border-black w-full h-16 md:w-16 md:h-full'>
      {/* 위 정렬 */}
      <div className='aspect-square text-center hidden md:block'>Pinner!</div>
      <div className='border-slate-300 border-solid border-b' />

      <ul className='flex md:flex-col gap-1 p-1 aspect-square'>
        {props.menus.map((menu) => (
          <NavLink
            key={menu.url}
            to={menu.url}
            className={({ isActive }) =>
              `${
                isActive ? 'bg-slate-400 dark:bg-slate-600' : ''
              } rounded-md p-1 flex flex-col items-center hover:bg-slate-100 dark:hover:bg-slate-700 bg-opacity-30 w-14`
            }
          >
            {menu.icon}
            <p className='text-xs select-none'>{menu.name}</p>
          </NavLink>
        ))}
      </ul>

      {/*  */}
      <div className='flex flex-auto border-slate-300 border-solid border-b hidden md:block'></div>

      {/* 밑 정렬 */}
      <Link to='/settings'>
        <StringAvatar name={'HongGilDong'}></StringAvatar>
      </Link>
    </div>
  );
}

// Avatar 이름에 따른 약자
function StringAvatar(props: { name: string }) {
  let abbreviation = '';
  if (props.name) {
    const [firstName, lastName] = (props.name || '').split(' ');
    if (firstName) abbreviation += firstName[0];
    if (lastName) abbreviation += lastName[0];
  }

  // Avatar 이름에 따른 배경 색상(랜덤)
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const bgColor = stringToColor(props.name);

  return (
    <div className='p-2'>
      <p
        className={`bg-[${bgColor}] cursor-pointer select-none flex w-full items-center justify-center aspect-square rounded-full text-4xl font-extrabold text-white`}
      >
        {abbreviation.toUpperCase()}
      </p>
    </div>
  );
}
