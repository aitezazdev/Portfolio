import Navbar from "@/components/Navbar";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Providers from "@/components/Providers";

export default function ProjectLayout({ children }) {
  return (
    <Providers>
      <SmoothScrollProvider>
        <Navbar hamburgerOnly={true} />
        {children}
      </SmoothScrollProvider>
    </Providers>
  );
}
