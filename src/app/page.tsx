import Search from "@/components/Search";
import ListCars from "@/components/cars/ListCars";
import HeroSection from "@/components/layouts/HeroSection";
import { notFound } from "next/navigation";
import queryString from "query-string";

let isLoading: boolean;
let base_url: string;
if (process.env.NODE_ENV === "development") {
  base_url = "http://localhost:3000";
} else {
  base_url = "https://assesment-pi.vercel.app";
}

const fetchPopular = async () => {
  const res = await fetch(`${base_url}/api/getPopularCars`);
  if (res.status !== 200) {
    return notFound();
  }
  isLoading = false;
  return res.json();
};

const fetchAllCars = async ({ page }: { page: string }) => {
  isLoading = true;
  const urlParams = {
    page,
  };
  const searchQuery = queryString.stringify(urlParams);
  const res = await fetch(`${base_url}/api/getAllCars`, {
    next: { revalidate: 30 },
  });
  if (res.status !== 200) {
    return notFound();
  }
  isLoading = false;
  return res.json();
};
export default async function Home({
  searchParams: { page },
}: {
  searchParams: { page: string };
}) {
  const data = await fetchAllCars({ page });

  const popular = await fetchPopular();
  const popularMake = popular && popular[1];
  // console.log(page);
  const cars = data[1];

  return (
    <main className="flex min-h-screen flex-col ">
      <HeroSection cars={cars} />
      <div className="  my-6 px-4 relative max-w-[1100px] min-h-screen mx-auto w-full lg:-right-1 xl:-right-20">
        <ListCars cars={cars} isLoading={isLoading} popularMake={popularMake} />
      </div>
    </main>
  );
}
