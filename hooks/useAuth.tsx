"use client";

import { useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createClient } from "@/lib/supabase/client";
import { getMemberById } from "@/services/members/members.service";
import { userAtom, memberAtom, authLoadingAtom } from "@/stores/auth";
import type { Member } from "@/services/members/members.types";
import type { User } from "@supabase/supabase-js";

interface UseAuthReturn {
  user: User | null;
  member: Member | null;
  loading: boolean;
  setMember: (member: Member | null) => void;
}

let authInitStarted = false;

export function useAuthInit() {
  const setUser = useSetAtom(userAtom);
  const setMember = useSetAtom(memberAtom);
  const setLoading = useSetAtom(authLoadingAtom);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || authInitStarted) return;
    initRef.current = true;
    authInitStarted = true;

    const supabase = createClient();
    let initialFetchDone = false;

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        getMemberById(supabase, currentUser.id).then(({ data }) => {
          setMember(data);
          setLoading(false);
          initialFetchDone = true;
        });
      } else {
        setLoading(false);
        initialFetchDone = true;
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!initialFetchDone) return;

      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        getMemberById(supabase, sessionUser.id).then(({ data }) => {
          setMember(data);
        });
      } else {
        setMember(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      authInitStarted = false;
    };
  }, [setUser, setMember, setLoading]);
}

export function useAuth(): UseAuthReturn {
  const user = useAtomValue(userAtom);
  const [member, setMember] = useAtom(memberAtom);
  const loading = useAtomValue(authLoadingAtom);

  return { user, member, loading, setMember };
}
