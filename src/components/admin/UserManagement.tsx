import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, Shield, Loader2, UserCog } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: AppRole;
}

export function UserManagement() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      setIsLoading(false);
      return;
    }

    // Fetch roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    }

    // Combine profiles with roles
    const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
      const userRole = roles?.find(r => r.user_id === profile.id);
      return {
        ...profile,
        role: userRole?.role || 'user',
      };
    });

    setUsers(usersWithRoles);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    setUpdatingUserId(userId);
    
    // Check if user already has a role entry
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let error;
    
    if (existingRole) {
      // Update existing role
      const result = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);
      error = result.error;
    } else {
      // Insert new role
      const result = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });
      error = result.error;
    }

    if (error) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: language === 'pl' ? 'Nie udało się zmienić roli' : 'Failed to change role',
        variant: 'destructive',
      });
    } else {
      toast({
        title: language === 'pl' ? 'Sukces' : 'Success',
        description: language === 'pl' ? 'Rola została zmieniona' : 'Role has been updated',
      });
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    
    setUpdatingUserId(null);
  };

  const handleDeleteUser = async (userId: string) => {
    // Delete profile (cascade will handle related records)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: language === 'pl' ? 'Nie udało się usunąć użytkownika' : 'Failed to delete user',
        variant: 'destructive',
      });
    } else {
      toast({
        title: language === 'pl' ? 'Sukces' : 'Success',
        description: language === 'pl' ? 'Użytkownik został usunięty' : 'User has been deleted',
      });
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return language === 'pl' ? 'Administrator' : 'Admin';
      case 'moderator':
        return language === 'pl' ? 'Moderator' : 'Moderator';
      default:
        return language === 'pl' ? 'Użytkownik' : 'User';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          {language === 'pl' ? 'Zarządzanie użytkownikami' : 'User Management'}
        </CardTitle>
        <CardDescription>
          {language === 'pl' 
            ? 'Zarządzaj rolami użytkowników i ich kontami' 
            : 'Manage user roles and accounts'}
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={language === 'pl' ? 'Szukaj użytkownika...' : 'Search users...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'pl' ? 'Użytkownik' : 'User'}</TableHead>
              <TableHead>{language === 'pl' ? 'Rola' : 'Role'}</TableHead>
              <TableHead>{language === 'pl' ? 'Data rejestracji' : 'Registered'}</TableHead>
              <TableHead className="text-right">{language === 'pl' ? 'Akcje' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value: AppRole) => handleRoleChange(user.id, value)}
                    disabled={updatingUserId === user.id}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {updatingUserId === user.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            getRoleLabel(user.role)
                          )}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{language === 'pl' ? 'Użytkownik' : 'User'}</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="moderator">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">{language === 'pl' ? 'Moderator' : 'Moderator'}</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{language === 'pl' ? 'Administrator' : 'Admin'}</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {language === 'pl' ? 'Usuń użytkownika' : 'Delete User'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {language === 'pl' 
                            ? `Czy na pewno chcesz usunąć użytkownika ${user.name} (${user.email})? Ta akcja jest nieodwracalna.`
                            : `Are you sure you want to delete user ${user.name} (${user.email})? This action cannot be undone.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {language === 'pl' ? 'Anuluj' : 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {language === 'pl' ? 'Usuń' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  {language === 'pl' ? 'Brak użytkowników' : 'No users found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
