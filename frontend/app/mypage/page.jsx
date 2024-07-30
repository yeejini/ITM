"use client";
import React, { use, useEffect, useState } from "react";
import DevImg from "../../components/Devlmg";
import { Cookies } from "react-cookie";
import { Calendar } from "../../components/ui/calendar"
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge"
import { getUserList, getMypageReport, postLogout, getReport,updateLogin  } from "../api";
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
// import ProjectCard from '@/components/ProjectCard';
import Link from "next/link";
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { BUILD_ID_FILE } from "next/dist/shared/lib/constants";
import MyPageReport from "./report";



const Mypage = () => {
  const cookies = new Cookies();
  const router = useRouter();  // useRouter 훅 초기화


  // const [categories, setCategories] = useState(uniqueCategories);
  // const [category, setCategory] = useState('all projects');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const accessToken = cookies.get('access_token'); // Assuming your access token key is 'access_token'
  const [activeTab, setActiveTab] = useState('point1'); // 현재 활성 탭 상태 추가
  const [itvInfo, setItvInfo] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);  // 선택된 날짜를 관리하는 상태 변수
  const [selectedItvNo, setSelectedItvNo] = useState(null);  // 선택된 인터뷰 번호 상태 추가
  const [ItvNoKey, setItvNoKey] = useState(null);
  const [Data, setData] = useState(null);
  const [selectedFbUrl, setSelectedFbUrl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const user_id = cookies.get('user_id');

  const [formData, setFormData] = useState({
    user_id: cookies.get('user_id'),
    name: '',
    nickname: '',
    gender: '',
    birthday: '',
    tel: ''
  });

  useEffect(() => {
    
    const checkLoginStatus = async () => {
      const user_id = cookies.get('user_id');
      if (!user_id) {
        router.push('/login'); // 로그인 되어 있지 않으면 로그인 페이지로 리다이렉트
        return;
      }
     

      try {
        const data = await getUserList(user_id);
        setUserData(data.user_info);
        cookies.set("user_uuid", data.user_info.user_uuid)
        
        setFormData({

          name: data.user_info.user_nm,
          nickname: data.user_info.user_nicknm,
          gender: data.user_info.user_gender,
          birthday: data.user_info.user_birthday,
          tel: data.user_info.user_tel
        });

       
        cookies.set("user_nm", data.user_info.user_nm);
      
        const reportResponse = await getMypageReport(user_id);  // getMypageReport 함수로 인터뷰 데이터를 가져옵니다.
        console.log(reportResponse)
        console.log(Object.keys(reportResponse.itv_info))
        const itvData = reportResponse.itv_info ? Object.values(reportResponse.itv_info) : [];
        const itvNo = Object.keys(reportResponse.itv_info)
        setItvInfo(itvData);
        setItvNoKey(itvNo);
        console.log(setItvNoKey);


      } catch (error) {
        setError("Failed to fetch user data: " + error.message);
      }
    };

    checkLoginStatus();
  }, []);
  


  const handleLogout = async () => {
    try {
      const logout_formData = new FormData();
      logout_formData.append('access_token', accessToken);

      const response = await postLogout(logout_formData);   
      console.log(response);   
      if (response.logout === 'success') {
        cookies.remove('access_token'); // Remove access token from cookies
        cookies.remove('user_id'); // Remove user_id from cookies
        console.log("Logged out successfully");
        router.push('/login'); // Redirect to login page after logout
      } else {
        console.error("Logout failed:", response); // Log if logout is not successful
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };


  //update user infor - patch
  const handleUpdate = async () => {
     if (isEditable) {
      try {
        const update_formData = new FormData();
        update_formData.append('user_id', user_id);
        update_formData.append('name', formData.name);
        update_formData.append('nickname', formData.nickname);
        update_formData.append('gender', formData.gender);
        update_formData.append('birthday', formData.birthday);
        update_formData.append('tel', formData.tel);

        const response = await updateLogin(update_formData);
        console.log(response);
      } catch (error) {
        console.error("Update failed:", error.message);
      }
    }
    setIsEditable(!isEditable);
  };




  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      const interviewDates = itvInfo.map(itv => itv.itv_date);
  
      // 인터뷰 날짜인 경우 highlight 클래스를 반환
      if (interviewDates.includes(formattedDate)) {
        return 'highlight';
      }
    }
    return null;
  };
  
const handleDateClick = (date) => {
  setSelectedDate(date);
};

const handleButtonClick = async (itv_no) => {
  setSelectedItvNo(itv_no);  // 클릭된 인터뷰 번호를 상태에 저장


};


    return (
      <section className="min-h-screen pt-12 bg-blue-100">
      <div className="container mx-auto">
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto"> 
          My Page
        </h2>
        <div className="flex flex-col xl:flex-row items-center">
          <div className="flex-1">
            {selectedItvNo ? (
              <MyPageReport itv_no={selectedItvNo} />
            ) : (
              <Tabs defaultValue="point1" onValueChange={(value) => setActiveTab(value)}>
                <TabsList className='w-full grid xl:grid-cols-2 xl:max-w-[520px] xl:border dark:border-none mx-auto justify-center'>
                  <TabsTrigger value='point1'>My Information</TabsTrigger>
                  <TabsTrigger value='point2'>My Report</TabsTrigger>
                </TabsList>
                <div className="text-lg mt-12 xl:mt-8">
                  <TabsContent value='point1'>
                    <div className="text-center xl:text-left">
                      <Card className="w-[350px] mx-auto">
                        <CardHeader>
                          <CardTitle>MY INFORMATION</CardTitle>
                          <CardDescription>Welcome to 
                          {userData && (
                            <>
                            <span> {userData.user_nm}</span> !
                            </>
                          )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form>
                            <div className="grid w-full items-center gap-4">
                              {userData && (
                                <>
                                  <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      value={formData.name}
                                      readOnly={!isEditable}
                                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input
                                      id="nickname"
                                      value={formData.nickname}
                                      readOnly={!isEditable}
                                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Input
                                      id="gender"
                                      value={formData.gender}
                                      readOnly={!isEditable}
                                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="birthday">Birthday</Label>
                                    <Input
                                      id="birthday"
                                      value={formData.birthday}
                                      readOnly={!isEditable}
                                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="tel">Phone Number</Label>
                                    <Input
                                      id="tel"
                                      value={formData.tel}
                                      readOnly={!isEditable}
                                      onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button className='gap-x-2' onClick={handleUpdate}>{isEditable ? "Save" : "Update"}</Button>
                          <Button className='gap-x-2' onClick={handleLogout}>로그아웃</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value='point2'>
                    <div className="grid grid-cols-[300px_1fr] gap-8 p-8">
                      <div className="flex flex-col gap-4 border-r pr-8">
                        <Calendar mode="single" initialFocus getTileClassName={getTileClassName} onDateClick={handleDateClick} />
                      </div>
                      <div className="grid gap-6">
                        {itvInfo.map((itv, index) => (
                          <Card key={index} onClick={() => handleButtonClick(ItvNoKey[index])}>
                            <CardContent className="grid gap-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{itv.itv_sub}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{new Date(itv.itv_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {/* 인터뷰 설명을 여기에 추가하세요. */}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{itv.itv_cate}</Badge>
                                <Badge variant="outline">{itv.itv_job}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Mypage


function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

