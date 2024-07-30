"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button"; // Button 컴포넌트 임포트
import { Cookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { postSignup } from "../api";

const Signup = () => {
  const cookies = new Cookies();
  const router = useRouter();

  const [formData, setFormData] = useState({
    user_id: cookies.get('user_id'),
    name: "",
    nickname: "",
    gender: "",
    birthday: "",
    tel: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const signup_formDta = new FormData();
      signup_formDta.append('user_id', formData.user_id);
      signup_formDta.append('name', formData.name);
      signup_formDta.append('nickname', formData.nickname);
      signup_formDta.append('gender', formData.gender);
      signup_formDta.append('birthday', formData.birthday);
      signup_formDta.append('tel', formData.tel);


      const response = await postSignup(signup_formDta);
      console.log(response);

      // 회원가입 성공 후 페이지 이동
      router.push('/mypage');

      // 쿠키에 폼 데이터 저장 (옵션이 필요하다면 추가)
      Object.keys(formData).forEach((key) => {
        cookies.set(key, formData[key], { path: "/" });
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      // 에러 처리 로직
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid w-full max-w-sm gap-4">
        <h1 className="text-2xl font-bold mb-4 text-center">회원가입</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nickname">Nickname</Label>
            <Input type="text" id="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gender">Gender</Label>
            <Input type="text" id="gender" placeholder="여/남" value={formData.gender} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="birthday">Birthday</Label>
            <Input type="text" id="birthday" placeholder="0000-00-00" value={formData.birthday} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tel">Phone Number</Label>
            <Input type="tel" id="tel" placeholder="010-1234-5678" value={formData.tel} onChange={handleChange} />
          </div>
          <div className="mt-4"> {/* Add margin-top to separate the button from the inputs */}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
