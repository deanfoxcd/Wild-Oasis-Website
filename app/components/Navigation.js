import Link from 'next/link';

function Navigation() {
  return (
    <ul>
      <li>
        <Link href='/'>Home page</Link>
      </li>
      <li>
        <Link href='/cabins'>Cabins page</Link>
      </li>
      <li>
        <Link href='/about'>About page</Link>
      </li>
      <li>
        <Link href='/account'>Account page</Link>
      </li>
    </ul>
  );
}

export default Navigation;
