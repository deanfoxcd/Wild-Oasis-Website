// import { unstable_noStore } from 'next/cache';
import CabinCard from '../_components/CabinCard';

import { getCabins } from '../_lib/data-service';

async function CabinList({ filter }) {
  // unstable_noStore();

  const cabins = await getCabins();

  if (!cabins.length) return null;

  let displayCabins;
  switch (filter) {
    case 'all':
      displayCabins = cabins;
      break;
    case 'small':
      displayCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
      break;
    case 'medium':
      displayCabins = cabins.filter(
        (cabin) => cabin.maxCapacity > 3 && cabin.maxCapacity <= 7
      );
      break;
    case 'large':
      displayCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
      break;
  }

  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14'>
      {displayCabins.map((cabin) => (
        <CabinCard
          cabin={cabin}
          key={cabin.id}
        />
      ))}
    </div>
  );
}

export default CabinList;
