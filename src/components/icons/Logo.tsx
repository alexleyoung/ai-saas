import Image from 'next/image';

const Logo = ({ ...props }) => (
  <Image src="/logo.png" alt="logo" height={32} width={32} {...props} />
);

export default Logo;
