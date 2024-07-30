"use client";

import React, { act, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { createPresignedUrlWithClient, getReport, patchReport, post_review, save_report } from "../api";
import { Card, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import ReactPlayer from 'react-player';
import { ResponsiveRadialBar } from '@nivo/radial-bar'
import { ResponsiveRadar } from '@nivo/radar'
import { Label } from "../../components/ui/label";


const Report = () => {


  const [data, setData] = useState(null);

  const [actionText, setActionText] = useState('');
  const [actionPercentage, setActionPercentage] = useState('');

  const [communicationPercentage, setCommunicationPercentage] = useState('');
  const [communicationNumber, setCommunicationNumber] = useState('');
  const [communicationText, setCommunicationText] = useState('');

  const [encouragement, setEncouragement] = useState('');
  const [initiativePercentage, setInitiativePercentage] = useState('');
  const [initiaiveNumber, setInitiativeNumber] = useState('');
  const [initiativeText, setInitiativeText] = useState('');

  const [overallScore, setOverallScore] = useState(0);

  const [problemSolvingPercentage, setProblemSolvingPercentage] = useState('');
  const [problemSolvingNumber, setProblemSolvingNumber] = useState('');
  const [problemSolvingText, setProblemSolvingText] = useState('');

  const [relevantExperiencePercentage, setRelevantExperiencePercentage] = useState('');
  const [relevantNumber, setRelevantNumber] = useState('');
  const [relevantExperienceText, setRelevantExperienceText] = useState('');

  const [resultText, setResultText] = useState('');
  const [resultPercentage, setResultPercentage] = useState('');

  const [situationText, setSituationText] = useState('');
  const [situationPercentage, setSituationPercentage] = useState('');

  const [taskPercentage, setTaskPercentage] = useState('');
  const [taskText, setTaskText] = useState('');

  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  
  const cookies = new Cookies();
  const user_nm = cookies.get('user_nm');
  // const user_id = "yejin8329@daum.net"; // 쿠키에서 user_id 가져오기
  // const itv_no = "7054ab6aa4b4465da144b4aca94a1b19_240716_100"; 

  const user_id = cookies.get('user_id'); // 쿠키에서 user_id 가져오기
  const itv_no = cookies.get('itv_no');  // itv_no 값을 정의해야 합니다
  
  const [video, setVideo] = useState('');
  const [audio, setAudio] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [report_data, setreport_data] = useState('');
  const user_uuid = cookies.get('user_uuid');
  const itv_cnt = cookies.get('itv_cnt');

  const showModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user_id && itv_no) {
          const review_formData = new FormData();
          review_formData.append('itv_no', itv_no);
          const review_response = await post_review(review_formData);
          console.log(review_response);
          console.log(review_response.toString());


          //post_review의 response값을 string으로 변환 후, s3에
          const stringObject = JSON.stringify(review_response);
         
          console.log(stringObject);

            const report_formData = new FormData()
            const now = Date.now()
            setreport_data(`${user_uuid}/${itv_cnt}/${now}_report.json`);
            report_formData.append('report_data',`${user_uuid}/${itv_cnt}/${now}_report.json`)
            report_formData.append('report_json', stringObject);
            console.log(report_data);
            
            await save_report(report_formData);


          //report db upload patch
          const report_db_formData = new FormData();
          report_db_formData.append('user_id', user_id);
          report_db_formData.append('itv_no', itv_no);
          report_db_formData.append('itv_qs_cnt', 3);
          report_db_formData.append('user_uuid',`${user_uuid}`);
          report_db_formData.append('itv_cnt',`${itv_cnt}`);
          report_db_formData.append('now',`${now}`);
          //report_db_formData.append('itv_fb_url', `s3://simulation-userdata/${user_uuid}/${itv_cnt}/${now}_report.json`);

          const report_db_response = await patchReport(report_db_formData);
          console.log(report_db_response);



          const extractPercentageAndText = (text) => {
            var tmp = text.split(/%,\s*|%\s*,\s*/);  // '%,' 또는 '%, '로 분할, '% ,'도 포함
            const result = tmp.slice(1).join(" ");
            
            // tmp[0]에 %를 다시 붙여줍니다.
            tmp[0] = tmp[0] + '%';

          
            return [tmp[0], result];
          };
            const PercentageNonNumber = (text) => {
              var num = text.split('%, ')
              return [num[0]];
            }
            const ScoreNonePercentage = (text) => {
              var score = text.replace('%','')

              return Number(score);
            }

            const overallScore2 = ScoreNonePercentage(review_response.overall_score);
            setOverallScore(overallScore2);
            console.log(overallScore2);


            const [actionPercentage, actionText] = extractPercentageAndText(review_response.action);
            setActionPercentage(actionPercentage);
            setActionText(actionText);

            const [communicationPercentage, communicationText] = extractPercentageAndText(review_response.communication_skills);
            const [communicationNumber] = PercentageNonNumber(review_response.communication_skills);
            setCommunicationPercentage(communicationPercentage);
            setCommunicationText(communicationText);
            setCommunicationNumber(communicationNumber);
            console.log(communicationNumber);

            setEncouragement(review_response.encouragement);
            const [initiativePercentage, initiativeText] = extractPercentageAndText(review_response.initiative);
            const [initiaiveNumber] = PercentageNonNumber(review_response.initiative);
            setInitiativeNumber(initiaiveNumber);
            setInitiativePercentage(initiativePercentage);
            setInitiativeText(initiativeText);


            const [problemSolvingPercentage, problemSolvingText] = extractPercentageAndText(review_response.problem_solving);
            const [problemSolvingNumber] = PercentageNonNumber(review_response.problem_solving);
            setProblemSolvingNumber(problemSolvingNumber);
            setProblemSolvingPercentage(problemSolvingPercentage);
            setProblemSolvingText(problemSolvingText);
            const [relevantExperiencePercentage, relevantExperienceText] = extractPercentageAndText(review_response.relevant_experience);
            const [relevantNumber] = PercentageNonNumber(review_response.relevant_experience);
            setRelevantNumber(relevantNumber);
            setRelevantExperiencePercentage(relevantExperiencePercentage);
            setRelevantExperienceText(relevantExperienceText);

            const [resultPercentage, resultText] = extractPercentageAndText(review_response.result);
            setResultPercentage(resultPercentage);
            setResultText(resultText);

            const [situationPercentage, situationText] = extractPercentageAndText(review_response.situation);
            setSituationPercentage(situationPercentage);
            setSituationText(situationText);

            const [taskPercentage, taskText] = extractPercentageAndText(review_response.task);
            setTaskPercentage(taskPercentage);
            setTaskText(taskText);

          
            
           

          const response = await getReport(user_id, itv_no);
          setData(response.itv_info[itv_no]);
          console.log(response);
          console.log(response.itv_info[itv_no]);

          const qs_info = response.itv_info[itv_no].qs_info;

          

          // 비디오, 오디오, 텍스트 파일을 비동기적으로 가져옴
          const fetchMediaData = async (key) => {
            const videoUrl = await createPresignedUrlWithClient(qs_info[key].qs_video_url);
            const audioUrl = await createPresignedUrlWithClient(qs_info[key].qs_audio_url);
            const textUrl = await createPresignedUrlWithClient(qs_info[key].qs_text_url);

            const textResponse = await fetch(textUrl);
            const textContent = await textResponse.text();

            return { videoUrl, audioUrl, textContent };
          };

          const keys = Object.keys(qs_info);
          const promises = keys.map(key => fetchMediaData(key));
          const results = await Promise.all(promises);

          const newVideos = {};
          const newAudios = {};
          const newFileContents = {};

          keys.forEach((key, index) => {
            newVideos[key] = results[index].videoUrl;
            newAudios[key] = results[index].audioUrl;
            newFileContents[key] = results[index].textContent;
          });

          setVideo(newVideos);
          setAudio(newAudios);
          setFileContent(newFileContents);
        } else {
          console.error("User ID or ITV number is not found");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user_id, itv_no]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
          <p className="text-muted-foreground">Report 생성 중입니다. 새로고침 하지 마시고 잠시만 기다려주세요!</p>
        </div>
      </div>
    )
  
  }

  const questionCards = Object.keys(data.qs_info).map((key) => (
    <Card key={key} className="flex flex-col h-full">
      <CardHeader className="flex-1 flex flex-col justify-between p-6">
        <div>
        <h2 className="text-xl font-bold mb-2">
              Question {key} <br />
              {data.qs_info[key].qs_content}
    
              <div className="bg-muted px-4 py-2 rounded-md text-muted-foreground font-medium">
              {fileContent[key] && <div>{fileContent[key]}</div>}</div>
            </h2>
          <p className="text-muted-foreground">
            
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            showModal(
              data.qs_info[key].qs_content,
              <div><ReactPlayer
                  url={video[key]}
                  controls
                  height="400px"
                />{fileContent[key]}</div>
          
            )
          } 
        >
          View Details
        </Button>
      </CardHeader>
    </Card>
  ));
  
  const questionModal = Object.keys(data.qs_info).map((key) => (
    <Dialog key={key} open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogContent className="sm:max-w-[60vw] max-w-screen-lg max-h-screen-lg">
    <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="prose">{modalContent}</div>
          <div className="flex gap-2">
          </div>
        </div>
        <DialogFooter>
          <div>
            <Button type="button" onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ));




  function MyResponsiveRadialBar() {
    const data = [
      {
        "id": "SCORE",
        "data": [
          {
            "x": "SCORE",
            "y": overallScore
          }
        ]
      }
    ];
    console.log(overallScore)
    return (
    <ResponsiveRadialBar
    data={data}
      valueFormat=" >-.2f"
      startAngle={-90}
      maxValue={100}
      endAngle={90}
      padding={0.4}
      margin={{ top: 25, right: 10, bottom: 0, left: 10 }}
      colors={{scheme: 'category10' }}
      radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          justify: false,
          translateX: -50,
          translateY: 0,
          itemsSpacing: 6,
          itemDirection: 'left-to-right',
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          symbolSize: 18,
          symbolShape: 'square',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000'
              }
            }
          ]
        }
      ]}
    />
    );
  };

  function MyResponsiveRadar () {
    const data = [
      {
        "taste": "Relevant Experience",
        "Score": relevantNumber
      },
      {
        "taste": "Problem-Solving",
        "Score": problemSolvingNumber
      },
      {
        "taste": "Communication",
        "Score": communicationNumber
      },
      {
        "taste": "Initiative",
        "Score": initiaiveNumber
      }
    ];
    
    return (
      <ResponsiveRadar
      data={data}
      keys={[ 'Score']}
      indexBy="taste"
      valueFormat=">-.2f"
      margin={{ top: 70, right: 80, bottom: 55, left: 80 }}
      borderColor={{ from: 'color' }}
      gridLabelOffset={36}
      dotSize={10}
      dotColor={{ theme: 'background' }}
      dotBorderWidth={2}
      colors={{ scheme: 'category10' }}
      blendMode="multiply"
      motionConfig="wobbly"
      legends={[
          {
              anchor: 'top-left',
              direction: 'column',
              translateX: -50,
              translateY: -40,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: '#999',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemTextColor: '#000'
                      }
                  }
              ]
          }
      ]}
  />
    );
  };

  
 

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
    <h1 className="text-3xl font-bold mb-6">Q&A Report</h1>
    <div className="h-[50vh]">
      <MyResponsiveRadialBar/>
      <Label
      className='absolute w-[60vw] h-[10vh] text-4xl' 
      style={{ 
        top: '60%', 
        left: '50%', 
        transform: 'translate(-20%, -1%)',
        backgroundColor: 'transparent',  
        color: 'black'
        }}>{user_nm}님의 SCORE: {overallScore}점</Label>
    </div>


    <div className="space-y-8 p-4">
    <div className="flex flex-col md:flex-row md:space-x-8">
      <div className="flex-1">
        <MyResponsiveRadar className="h-[23vh] aspect-[4/3]" />

      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-blue-500">{relevantExperiencePercentage}</div>
          <div>
            <h3 className="text-lg font-semibold">Relevant Experience</h3>
            <p className="text-sm text-muted-foreground">
              {relevantExperienceText}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold text-blue-500">{problemSolvingPercentage}</div>
          <div>
            <h3 className="text-lg font-semibold">Problem-Solving Skills</h3>
            <p className="text-sm text-muted-foreground">
            {problemSolvingText}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-blue-500">{communicationPercentage}</div>
          <div>
            <h3 className="text-lg font-semibold">Communication Skills</h3>
            <p className="text-sm text-muted-foreground">
            {communicationText}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-blue-500">{initiativePercentage}</div>
          <div>
            <h3 className="text-lg font-semibold">Initiative</h3>
            <p className="text-sm text-muted-foreground">
            {initiativeText}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-blue-500">STAR Method</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              S
            </div>
            <div className="text-xl font-semibold">Situation</div>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-3xl font-bold text-blue-500">{situationPercentage}</div>
            <p className="text-sm text-muted-foreground">
            {situationText}
            </p>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              T
            </div>
            <div className="text-xl font-semibold">Task</div>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-3xl font-bold text-blue-500">{taskPercentage}</div>
            <p className="text-sm text-muted-foreground">
            {taskText}
            </p>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              A
            </div>
            <div className="text-xl font-semibold">Action</div>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-3xl font-bold text-blue-500">{actionPercentage}</div>
            <p className="text-sm text-muted-foreground">
            {actionText}
            </p>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              R
            </div>
            <div className="text-xl font-semibold">Result</div>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-3xl font-bold text-blue-500">{resultPercentage}</div>
            <p className="text-sm text-muted-foreground">
            {resultText}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

    <div className="flex flex-col gap-6">
      {/* <div className="bg-muted px-4 py-2 rounded-md text-muted-foreground font-medium">action:{review}</div> */}
      <div className="grid grid-cols-1 gap-6">
        {questionCards}
      </div>
    </div>
    {questionModal}
  </div>
  );
};
export default Report;





