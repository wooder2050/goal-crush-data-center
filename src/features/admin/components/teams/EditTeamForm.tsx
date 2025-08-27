'use client';

import { Edit } from 'lucide-react';

import { teamFormSchema, TeamFormValues } from '@/common/form/fields/team';
import { useGoalForm } from '@/common/form/useGoalForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type TeamType = {
  team_id: number;
  team_name: string;
  founded_year?: number | null;
  description?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  logo?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

interface EditTeamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamType;
  onSubmit: (values: TeamFormValues) => void;
  isLoading: boolean;
}

export function EditTeamForm({
  open,
  onOpenChange,
  team,
  onSubmit,
  isLoading,
}: EditTeamFormProps) {
  const form = useGoalForm<TeamFormValues, typeof teamFormSchema>({
    zodSchema: teamFormSchema,
    defaultValues: {
      team_name: team.team_name,
      founded_year: team.founded_year ? team.founded_year.toString() : '',
      description: team.description || '',
      primary_color: team.primary_color || '#000000',
      secondary_color: team.secondary_color || '#FFFFFF',
      logo: team.logo || '',
    } as unknown as TeamFormValues,
  });

  const handleSubmit = async (values: TeamFormValues) => {
    try {
      await onSubmit(values);
    } catch {
      // Error is handled in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />팀 정보 수정
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="team_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>팀명 *</FormLabel>
                  <FormControl>
                    <Input placeholder="팀명을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="founded_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>창단년도</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2020"
                      {...field}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="팀 소개를 입력하세요"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>기본 컬러</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          placeholder="#000000"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>보조 컬러</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          placeholder="#FFFFFF"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>로고 URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '수정 중...' : '수정'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
