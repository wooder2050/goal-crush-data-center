'use client';

import {
  matchResultFormSchema,
  type MatchResultFormValues,
} from '@/common/form/fields';
import { useGoalForm } from '@/common/form/useGoalForm';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { H2 } from '@/components/ui/typography';

interface ScoreTabProps {
  match: {
    home_team: { team_name: string };
    away_team: { team_name: string };
    home_score: number | null;
    away_score: number | null;
    penalty_home_score: number | null;
    penalty_away_score: number | null;
  };
  onSubmit: (values: MatchResultFormValues) => Promise<void>;
}

export default function ScoreTab({ match, onSubmit }: ScoreTabProps) {
  // 경기 정보에서 폼 기본값 설정
  const defaultFormValues: MatchResultFormValues = {
    home_score: match.home_score !== null ? match.home_score.toString() : '0',
    away_score: match.away_score !== null ? match.away_score.toString() : '0',
    penalty_home_score:
      match.penalty_home_score !== null
        ? match.penalty_home_score.toString()
        : '',
    penalty_away_score:
      match.penalty_away_score !== null
        ? match.penalty_away_score.toString()
        : '',
  };

  const form = useGoalForm({
    zodSchema: matchResultFormSchema,
    defaultValues: defaultFormValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <H2 className="text-xl">{match.home_team.team_name}</H2>
            <FormField
              control={form.control}
              name="home_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>홈팀 점수</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="penalty_home_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>홈팀 승부차기 점수 (선택사항)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    동점 후 승부차기가 있었을 경우만 입력
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <H2 className="text-xl">{match.away_team.team_name}</H2>
            <FormField
              control={form.control}
              name="away_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>원정팀 점수</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="penalty_away_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>원정팀 승부차기 점수 (선택사항)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    동점 후 승부차기가 있었을 경우만 입력
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">스코어 저장 및 다음 단계</Button>
        </div>
      </form>
    </Form>
  );
}
