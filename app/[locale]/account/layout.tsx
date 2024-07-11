import AccountBar from "@/components/AccountBar";
import PrivatePage from "@/components/PrivatePage";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrivatePage>
        <div className="pl-0 xl:pl-5">
          <div>
            <AccountBar />
          </div>
          <div className="pt-5 xl:min-h-[calc(100vh-545px)]">{children}</div>
        </div>
      </PrivatePage>
    </>
  );
}
