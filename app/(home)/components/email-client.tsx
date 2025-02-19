'use client';

import {
  Archive,
  ArrowDown,
  ArrowRight,
  Ban,
  Bold,
  Calendar,
  FileText,
  Inbox,
  Italic,
  Link2,
  MailPlus,
  Menu,
  Paperclip,
  Reply,
  ReplyAll,
  Search,
  Send,
  Settings,
  Smile,
  Strikethrough,
  Trash2,
  Underline,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Email } from '@prisma/client';
import { ComposeView } from './compose-view';
import EmailItem from './email-Item';
import ReadView from './read-view';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface EmailViewState {
  mode: 'read' | 'compose';
  selectedEmail: Email | null;
}

function SidebarSection({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100"
      >
        {isOpen ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        <span className="text-sm font-semibold">{label}</span>
      </button>
      {isOpen && <div className="space-y-1">{children}</div>}
    </div>
  );
}

export default function EmailClient({ emails }: { emails: Email[] }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/login');
    return;
  }

  const sidebarData = {
    favorites: [
      { icon: Inbox, label: 'Inbox', count: emails.length },
      { icon: FileText, label: 'Expenses' },
    ],
    accounts: [
      {
        email: 'Kiskayemoses@gmail.com',
        folders: [
          { icon: Inbox, label: 'Inbox', count: emails.length, isActive: true },
          { icon: FileText, label: 'Drafts' },
          { icon: Send, label: 'Sent Items', count: emails.length },
          { icon: Trash2, label: 'Deleted Items' },
          { icon: Ban, label: 'Junk Email' },
          { icon: Archive, label: 'Archive' },
        ],
      },
    ],
  };

  const [viewState, setViewState] = React.useState<EmailViewState>({
    mode: 'compose',
    selectedEmail: null,
  });

  const [sections, setSections] = React.useState({
    today: true,
    yesterday: true,
    pinned: true,
  });

  const [sidebarSections, setSidebarSections] = React.useState({
    favorites: true,
    accounts: sidebarData.accounts.reduce(
      (acc, account) => ({
        ...acc,
        [account.email]: true,
      }),
      {} as Record<string, boolean>,
    ),
  });

  const handleNewEmail = () => {
    setViewState({
      mode: 'compose',
      selectedEmail: null,
    });
  };

  const handleSelectEmail = (email: Email) => {
    setViewState({
      mode: 'read',
      selectedEmail: email,
    });
  };

  const toolbarLinks = [
    {
      name: 'Home',
      isActive: false,
    },
    {
      name: 'View',
      isActive: false,
    },
    {
      name: 'Help',
      isActive: false,
    },
    {
      name: 'Message',
      isActive: true,
    },
    {
      name: 'insert',
      isActive: false,
    },
    {
      name: 'Format text',
      isActive: false,
    },
    {
      name: 'Options',
      isActive: false,
    },
  ];

  return (
    <div className="flex h-screen w-full items flex-col bg-white text-gray-900">
      {/* Top Navigation */}
      <div className="border-b bg-white rounded-lg shadow-sm sticky top-0 z-10">
        <div className="flex max-w-7xl mx-auto justify-between items-center gap-1 p-1">
          <div className="flex">
            <Button className="bg-transparent text-black shadow-none p-0">
              <Menu className="size-6" />
            </Button>
            {toolbarLinks.map((link, index) => {
              return (
                <Button key={index} variant="ghost">
                  <span
                    className={`${cn} ${link.isActive ? 'underline font-bold underline-offset-8' : ''}`}
                  >
                    {link.name}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center">
            <Calendar className="size-6 mr-1" />
            <div className="flex-col flex">
              <span className="text-sm font-bold text-muted-foreground">
                Lunch with Jane
              </span>
              <span className="text-xs text-muted-foreground">
                in 30 min at Fourth Coffee
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-t"> </div>
        <div className="flex max-w-7xl mx-auto gap-2 py-2">
          {[
            { icon: Reply, label: 'Reply' },
            { icon: ReplyAll, label: 'Reply All' },
            { icon: Archive, label: 'Archive' },
            { icon: Trash2, label: 'Delete' },
          ].map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
          <Separator orientation="vertical" className="h-6" />
          <select className="h-9 rounded border w-1/12 px-2 text-sm">
            <option>Aptos</option>
          </select>
          <select className="h-9 w-16 rounded border px-2 text-sm">
            <option>11</option>
          </select>
          {[
            { icon: Bold, label: 'Bold' },
            { icon: Italic, label: 'Italic' },
            { icon: Underline, label: 'Underline' },
            { icon: Strikethrough, label: 'Strikethrough' },
          ].map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
          <Separator orientation="vertical" className="h-6" />
          {[
            { icon: Paperclip, label: 'Attach' },
            { icon: Link2, label: 'Link' },
            { icon: Smile, label: 'Emoji' },
          ].map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      <div className="grid flex-1 max-w-7xl w-full mx-auto grid-cols-[240px_1fr_1fr] h-[calc(100vh-8rem)]">
        {/* Sidebar - Fixed */}
        <div className="border-r bg-white rounded-lg flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-2 relative">
              <Button
                onClick={handleNewEmail}
                className="w-full justify-start gap-2 bg-blue-600 text-white hover:bg-blue-700"
                size="sm"
              >
                <MailPlus className="h-4 w-4" />
                New mail
              </Button>

              <SidebarSection
                label="Favorites"
                isOpen={sidebarSections.favorites}
                onToggle={() =>
                  setSidebarSections((s) => ({
                    ...s,
                    favorites: !s.favorites,
                  }))
                }
              >
                {sidebarData.favorites.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 pl-8"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.count && (
                      <span className="ml-auto text-xs">{item.count}</span>
                    )}
                  </Button>
                ))}
              </SidebarSection>

              {sidebarData.accounts.map((account) => (
                <SidebarSection
                  key={account.email}
                  label={account.email}
                  isOpen={sidebarSections.accounts[account.email]}
                  onToggle={() =>
                    setSidebarSections((s) => ({
                      ...s,
                      accounts: {
                        ...s.accounts,
                        [account.email]: !s.accounts[account.email],
                      },
                    }))
                  }
                >
                  {account.folders.map((folder) => (
                    <Button
                      key={folder.label}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'w-full justify-start gap-2 pl-8',
                        folder.isActive && 'bg-blue-50',
                      )}
                    >
                      <folder.icon className="h-4 w-4" />
                      {folder.label}
                      {folder.count && (
                        <span className="ml-auto text-xs">{folder.count}</span>
                      )}
                    </Button>
                  ))}
                </SidebarSection>
              ))}

              <div className="mt-auto p-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  Upgrade to Microsoft 365
                </Button>
                {session && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="w-full justify-start gap-2"
                  >
                    Log Out
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Email List - Fixed */}
        {emails.length === 0 ? (
          <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
              <div className="text-center space-y-4">
                <Inbox className="h-16 w-16 text-gray-400 mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-700">
                  No Mail Found
                </h2>
                <p className="text-gray-500">
                  Your inbox is empty at the moment
                </p>
                <Button
                  onClick={handleNewEmail}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <MailPlus className="h-4 w-4 mr-2" />
                  Compose New Email
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col border-r bg-white h-full overflow-hidden">
            <Tabs defaultValue="focused" className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b p-2">
                <TabsList className="h-8">
                  <TabsTrigger value="focused">Focused</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <TabsContent
                value="focused"
                className="m-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="flex flex-col">
                    {/* Pinned Section */}
                    <div
                      className="flex items-center gap-2 p-2 hover:cursor-pointer"
                      onClick={() =>
                        setSections({ ...sections, pinned: !sections.pinned })
                      }
                    >
                      {sections.pinned ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        Pinned
                      </span>
                    </div>
                    {sections.pinned &&
                      emails
                        .filter((e) => e.isPinned)
                        .map((email) => (
                          <EmailItem
                            key={email.id}
                            email={email}
                            selected={viewState.selectedEmail?.id === email.id}
                            onSelect={() => handleSelectEmail(email)}
                          />
                        ))}

                    {/* Today Section */}
                    <div
                      className="flex items-center gap-2 p-2 hover:cursor-pointer"
                      onClick={() =>
                        setSections({ ...sections, today: !sections.today })
                      }
                    >
                      {sections.today ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        Today
                      </span>
                    </div>
                    {sections.today &&
                      emails
                        .filter((e) => e.section === 'Today')
                        .map((email) => (
                          <EmailItem
                            key={email.id}
                            email={email}
                            selected={viewState.selectedEmail?.id === email.id}
                            onSelect={() => handleSelectEmail(email)}
                          />
                        ))}

                    {/* Yesterday Section */}
                    <div
                      className="flex items-center gap-2 p-2 hover:cursor-pointer"
                      onClick={() =>
                        setSections({
                          ...sections,
                          yesterday: !sections.yesterday,
                        })
                      }
                    >
                      {sections.yesterday ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        Yesterday
                      </span>
                    </div>
                    {sections.yesterday &&
                      emails
                        .filter((e) => e.section === 'Yesterday')
                        .map((email) => (
                          <EmailItem
                            key={email.id}
                            email={email}
                            selected={viewState.selectedEmail?.id === email.id}
                            onSelect={() => handleSelectEmail(email)}
                          />
                        ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Email Content / Compose - Fixed */}
        <div className="flex flex-col bg-white p-4 h-full overflow-hidden">
          {viewState.mode === 'compose' ? (
            <div className="h-full overflow-auto">
              <ComposeView />
            </div>
          ) : viewState.selectedEmail ? (
            <div className="h-full overflow-auto">
              <ReadView email={viewState.selectedEmail} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select an email to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
