import React, { useState, useEffect } from 'react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Switch } from '../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useAuth } from '../contexts/AuthContext'
import { useThemeStore } from '../stores/themeStore'
import { storage } from '../lib/supabase'
import { getInitials } from '../lib/utils'
import {
  User,
  Mail,
  Lock,
  Palette,
  CreditCard,
  Bell,
  Shield,
  Save,
  Upload,
  Crown,
  Loader2,
  File,
  Download,
  Trash2,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  AlertCircle
} from 'lucide-react'

interface UserFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    size: number
    mimetype: string
  }
}

export function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useThemeStore()
  const [loading, setLoading] = useState(false)
  const [filesLoading, setFilesLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [userFiles, setUserFiles] = useState<UserFile[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    avatar_url: user?.user_metadata?.avatar_url || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      loadUserFiles()
    }
  }, [user])

  const loadUserFiles = async () => {
    if (!user) return
    
    setFilesLoading(true)
    try {
      const { data, error } = await storage.getUserFiles(user.id)
      if (error) {
        console.error('Error loading files:', error)
      } else {
        setUserFiles(data || [])
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setFilesLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB')
      return
    }

    setUploadLoading(true)
    setUploadError(null)

    try {
      const filePath = `${user.id}/${Date.now()}-${file.name}`
      const { error } = await storage.uploadFile('user-files', filePath, file)
      
      if (error) {
        setUploadError(error.message)
      } else {
        await loadUserFiles() // Refresh file list
        // Clear the input
        event.target.value = ''
      }
    } catch (error) {
      setUploadError('Failed to upload file')
      console.error('Upload error:', error)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleFileDelete = async (fileName: string) => {
    if (!user) return

    try {
      const filePath = `${user.id}/${fileName}`
      const { error } = await storage.deleteFile('user-files', filePath)
      
      if (error) {
        console.error('Delete error:', error)
      } else {
        await loadUserFiles() // Refresh file list
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleFileDownload = (fileName: string) => {
    if (!user) return

    const filePath = `${user.id}/${fileName}`
    const { data } = storage.getPublicUrl('user-files', filePath)
    
    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank')
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image
    if (mimeType.startsWith('video/')) return Video
    if (mimeType.startsWith('audio/')) return Music
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleProfileUpdate = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // TODO: Implement profile update logic with Supabase
      console.log('Profile update:', profileData)
      // This would typically update the user metadata in Supabase
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    // TODO: Implement password reset logic
    console.log('Password reset requested')
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="files">My Files</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your profile information and avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profileData.name || profileData.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Password Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Password & Security
                  </CardTitle>
                  <CardDescription>
                    Update your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handlePasswordReset}>
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your worlds and activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive news and product updates
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Files Tab */}
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="w-5 h-5" />
                  My Files
                </CardTitle>
                <CardDescription>
                  Upload and manage your personal files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Section */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">
                          Click to upload files
                        </span>
                        <span className="text-muted-foreground"> or drag and drop</span>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploadLoading}
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Status */}
                {uploadLoading && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-600">Uploading file...</span>
                  </div>
                )}

                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">{uploadError}</span>
                  </div>
                )}

                {/* Files List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Your Files</h3>
                    <Button variant="outline" size="sm" onClick={loadUserFiles} disabled={filesLoading}>
                      {filesLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Refresh'
                      )}
                    </Button>
                  </div>

                  {filesLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
                          <div className="w-10 h-10 bg-muted rounded" />
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded mb-2" />
                            <div className="h-3 bg-muted rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userFiles.length > 0 ? (
                    <div className="space-y-3">
                      {userFiles.map((file) => {
                        const FileIcon = getFileIcon(file.metadata?.mimetype || '')
                        return (
                          <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <FileIcon className="w-10 h-10 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{file.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{formatFileSize(file.metadata?.size || 0)}</span>
                                <span>•</span>
                                <span>{new Date(file.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFileDownload(file.name)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFileDelete(file.name)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No files uploaded yet</p>
                      <p className="text-sm">Upload your first file to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your preferred theme
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((themeOption) => (
                      <div
                        key={themeOption}
                        className={`cursor-pointer rounded-lg border-2 p-4 ${
                          theme === themeOption ? 'border-primary' : 'border-muted'
                        }`}
                        onClick={() => setTheme(themeOption as 'light' | 'dark' | 'system')}
                      >
                        <div className="space-y-2">
                          <div className="h-8 w-full rounded bg-muted" />
                          <div className="h-2 w-3/4 rounded bg-muted" />
                          <div className="h-2 w-1/2 rounded bg-muted" />
                        </div>
                        <p className="mt-2 text-sm font-medium capitalize">
                          {themeOption}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>
                    Manage your subscription and billing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {user?.user_metadata?.plan === 'pro' ? (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Shield className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium capitalize">{user?.user_metadata?.plan || 'Free'} Plan</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.user_metadata?.plan === 'pro' 
                            ? 'Unlimited worlds and premium features'
                            : 'Basic features with limited worlds'
                          }
                        </p>
                      </div>
                    </div>
                    {user?.user_metadata?.plan === 'free' && (
                      <Button>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View your past invoices and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No billing history available</p>
                    <p className="text-sm">Invoices will appear here once you upgrade</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}