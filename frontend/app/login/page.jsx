'use client';
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { getUserList, get_kakao } from "../api";

const Login = () => {
  const [email, setEmail] = useState('');
  const cookies = new Cookies();
  const router = useRouter();


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleButtonClick = async (event) => {
    // const url = await get_kakao();
    // console.log(url)
    // window.location.href = url;
    event.preventDefault(); // Prevent the default form submission behavior

  
     try {
    // 임시 로그인
    //const response = await getUserList("yejin8329@daum.net");
      const response = await getUserList(email); // 사용자가 입력한 이메일을 전달
      cookies.set('user_id', response.user_id);
      
      // 로그인 성공 시 mypage로 리다이렉트
      router.push('/mypage');
    } catch (error) {
      console.error('Login failed', error);
      // 실패 시 에러 처리

       try {
    // 임시 로그인
    //const response = await getUserList("yejin8329@daum.net");
      const response = await getUserList(email); // 사용자가 입력한 이메일을 전달
      cookies.set('user_id', response.user_id);
      
      // 로그인 성공 시 mypage로 리다이렉트
      router.push('/mypage');
    } catch (error) {
      console.error('Login failed', error);
      // 실패 시 에러 처리

      // 로그인 실패 시 signup으로 리다이렉트
      router.push('/signup');
    }
    }
  };

  return (
    <div className="container max-w-sm items-center justify-center">
    <div className="flex flex-col gap-3 items-center justify-center">
      <h2 className="text-xl font-semibold">로그인</h2>
      
      <form className="flex flex-col gap-5" onSubmit={handleButtonClick}>
        <div className="flex flex-row gap-3 items-center justify-center">
          <label className="items-center" htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="border rounded p-2"
            placeholder="Enter your email"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full h-12 bg-blue-500 text-white rounded">
          로그인
        </button>
      </form>
    </div>
  </div>
);
};

export default Login;
