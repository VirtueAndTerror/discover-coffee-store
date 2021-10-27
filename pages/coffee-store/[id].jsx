import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();
  console.log("router", router);
  return (
    <div>
      Coffe Store Page {router.query.id}
      <Link href='/'>
        <a>Back to Home</a>
      </Link>
      <Link href='/courses/nextjs'>
        <a>Go to page Next.js course</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
