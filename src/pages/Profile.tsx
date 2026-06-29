import { Mail, Phone, Shield } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/forms/FormField'
import { useAuthStore } from '@/store/auth.store'
import { roleLabels } from '@/mocks/users'
import { toast } from '@/store/toast.store'

export default function Profile() {
  const { currentUser } = useAuthStore()

  if (!currentUser) return null

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your account, preferences and security."
        breadcrumbs={[{ label: 'Profile' }]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar name={currentUser.name} size="lg" />
            <h2 className="mt-3 text-lg font-semibold">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">{currentUser.designation}</p>
            <Badge tone="info" className="mt-2">{roleLabels[currentUser.role]}</Badge>
            <div className="mt-6 w-full space-y-3 border-t border-border pt-6 text-left text-sm">
              <p className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{currentUser.email}</p>
              <p className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" />{currentUser.phone}</p>
              <p className="flex items-center gap-2"><Shield className="size-4 text-muted-foreground" />{currentUser.department}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Full Name"><Input defaultValue={currentUser.name} /></FormField>
                  <FormField label="Designation"><Input defaultValue={currentUser.designation} /></FormField>
                  <FormField label="Email"><Input defaultValue={currentUser.email} /></FormField>
                  <FormField label="Phone"><Input defaultValue={currentUser.phone} /></FormField>
                  <FormField label="Department" className="sm:col-span-2"><Input defaultValue={currentUser.department} /></FormField>
                  <div className="sm:col-span-2">
                    <Button onClick={() => toast.success('Profile updated', 'Your changes have been saved.')}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {['Approval requests', 'Rejections', 'Rate revision alerts', 'Weekly summary', 'Vendor updates'].map((label, i) => (
                    <div key={label} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                      <span className="text-sm">{label}</span>
                      <Checkbox defaultChecked={i < 3} label="Email" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:max-w-md">
                  <FormField label="Current Password"><Input type="password" /></FormField>
                  <FormField label="New Password"><Input type="password" /></FormField>
                  <FormField label="Confirm New Password"><Input type="password" /></FormField>
                  <Button onClick={() => toast.success('Password changed', 'Use your new password next sign-in.')}>Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
