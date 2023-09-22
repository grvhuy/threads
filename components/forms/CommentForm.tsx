"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";


interface Props {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

const CommentForm = ({ threadId, currentUserImage, currentUserId }: Props) => {

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
        thread: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname )

    form.reset();
  }


  return (
    <Form {...form}>
      <form
        className="comment-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full">
              <FormLabel>
                <Image src={currentUserImage} alt="User image"
                width={48}
                height={48}
                className="rounded-full object-cover" />
              </FormLabel>

              <FormControl className="border-none bg-transparent">
                <Input 
                  type="text"
                  placeholder="Comment..."
                  className="no-focus outline-none text-light-1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>


          )}
        />
          <Button type="submit" className="comment-form_btn"
          >
          Post Thread
          </Button>          
      </form>
    </Form>
  )
}

export default CommentForm