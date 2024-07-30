"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";

const Auth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const email_id = searchParams.get("email_id");
  const access_token = searchParams.get("access_token");
  const message = searchParams.get("message");

  console.log(email_id);
  console.log(access_token);
  
  const cookies = new Cookies();

  useEffect(() =>{
    if (email_id && access_token){
      cookies.set("user_id", email_id);
      cookies.set("access_token", access_token);
    }

    // 메시지에 따라 라우팅 처리
    if (message === "new") {
      router.push("/signup");
    } else if (message === "main") {
      router.push("/mypage");
    } else {
      // 기본적으로 "/"로 보내거나 다른 처리가 필요한 경우 추가
      router.push("/");
    }
  }, [email_id, access_token, message, cookies, router]);

  return <div></div>;
};

export default Auth;
