/**
 * Public components — vendored snapshot of "@morada-ai/niemeyer/components".
 *
 * This project does not have registry access to the real npm package, so
 * the design-system source (tokens/styles/components) is vendored directly
 * under `niemeyer/`. Only the primitives that exist in the snapshot are
 * re-exported here — see design-reference/README.md for the full upstream
 * component list; anything not listed below (Accordion, Calendar/DatePicker,
 * Command, HoverCard, InputGroup, Multiselect, Popover, RadioGroup, Sheet,
 * TimePicker, VisuallyHidden, Box/Inline/Paragraph, FormField, RichInput,
 * SelectAsync) was not part of the snapshot and is not used by this app.
 * ScrollArea and the sonner Toaster wrapper were filled in locally to
 * unblock Dialog and toast usage — see their files for details.
 */
export {
    ALERT_DEFAULT_ICONS,
    Alert,
    alertVariants,
    AlertAction,
    AlertDefaultIcon,
    AlertDescription,
    AlertTitle,
    IconAlertCircle,
    IconAlertTriangle,
    IconCircleCheck,
    IconInfoCircle,
} from "./ui/alert";
export type { AlertSemanticVariant } from "./ui/alert";
export {
    Avatar,
    AvatarImage,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarBadge,
} from "./ui/avatar";
export { Badge, badgeVariants } from "./ui/badge";
export { Button, buttonVariants } from "./ui/button";
export type { ButtonProps } from "./ui/button";
export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
} from "./ui/card";
export { Checkbox } from "./ui/checkbox";
export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogContentBody,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "./ui/dropdown-menu";
export { Heading, headingVariants } from "./ui/heading";
export { Input } from "./ui/input";
export type { InputShape } from "./ui/input";
export { Label } from "./ui/label";
export { Progress } from "./ui/progress";
export { ScrollArea, ScrollBar } from "./ui/scroll-area";
export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
export type { SelectTriggerShape } from "./ui/select";
export { Separator } from "./ui/separator";
export { Spinner } from "./ui/spinner";
export { Toaster, toast } from "./ui/sonner";
export { Switch } from "./ui/switch";
export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "./ui/table";
export {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    tabsListVariants,
} from "./ui/tabs";
export { Textarea } from "./ui/textarea";
export {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    TooltipWrapper,
} from "./ui/tooltip";
export type { TooltipWrapperProps } from "./ui/tooltip";

/* ─── Brand ──────────────────────────────────────────────────────────────── */
export { BrandIcon } from "./brand/icon";

/* ─── Blocks ─────────────────────────────────────────────────────────────── */
export {
    AppShell,
    EmptyState,
    PageHeaderRoot,
    PageHeaderContainer,
    PageHeaderTitle,
    PageHeaderDescription,
    PageHeaderBreadcrumbs,
    SidebarShell,
    SidebarRail,
    SidebarRailLogo,
    SidebarRailNav,
    SidebarRailItem,
    SidebarRailFooter,
    SidebarPanel,
    SidebarPanelHeader,
    SidebarPanelNav,
    SidebarPanelItem,
    SidebarPanelItemBadge,
    SidebarPanelFooter,
    TopBarShell,
    TopBarLeft,
    TopBarRight,
} from "./blocks";
export type {
    EmptyStateVariant,
    PageHeaderBreadcrumb,
    SidebarShellProps,
    SidebarShellVariant,
    SidebarRailItemProps,
    SidebarPanelProps,
    SidebarPanelHeaderProps,
    SidebarPanelItemProps,
} from "./blocks";
