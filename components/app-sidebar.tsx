import { Clock, Home, Search, Star } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
// Menu items.
const baseMenuConfig = [
  {
    title: "Search",
    key: "search",
    icon: Search,
  },
  {
    title: "Home",
    key: "home",
    url: "home",
    icon: Home,
  },
  {
    title: "Favorites",
    key: "favorites",
    url: "favorites",
    icon: Star,
  },
  {
    title: "Recent",
    key: "recent",
    url: "recent",
    icon: Clock,
  },
]

export function AppSidebar() {

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="contents ">
                <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                  <Avatar className="rounded-md overflow-hidden" >
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseMenuConfig.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {
                      item.url ? (
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <div className="cursor-pointer">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      )
                    }
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}