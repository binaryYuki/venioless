import type { ColumnsType } from "antd/es/table";

import React, { useState, useEffect } from "react";
import { Checkbox, Button, Modal, Table, message } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

interface Course {
  course_name: string;
  start_time: string;
  end_time: string;
  present: boolean;
  activity_datetime: number;
  initiallyPresent: boolean; // 新增字段
}

export default function CourseAttendanceForm() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    const attendInfo = localStorage.getItem("attend_info");

    if (!attendInfo) {
      setError("出勤信息未找到，请输入信息。");
      router.push("/input").then((r) => r);
    } else {
      try {
        const parsedData = JSON.parse(attendInfo);
        const savedCourses = parsedData.courses;

        if (Array.isArray(savedCourses)) {
          const coursesWithInitial = savedCourses.map((course) => ({
            ...course,
            initiallyPresent: course.present, // 初始化 initiallyPresent 字段
          }));

          setCourses(coursesWithInitial);
          setSelectedCourses(
            coursesWithInitial.filter((course) => course.present),
          );
        } else {
          setError(t("attendanceDataError"));
        }
      } catch {
        setError("出勤信息格式错误，请检查数据。");
      }
    }
  }, [router]);

  const handleAttendanceChange = (
    activity_datetime: number,
    checked: boolean,
  ) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.activity_datetime === activity_datetime
          ? { ...course, present: checked }
          : course,
      ),
    );
    setSelectedCourses((prevSelected) => {
      if (checked) {
        const courseToAdd = courses.find(
          (c) => c.activity_datetime === activity_datetime,
        );

        return courseToAdd ? [...prevSelected, courseToAdd] : prevSelected;
      } else {
        return prevSelected.filter(
          (course) => course.activity_datetime !== activity_datetime,
        );
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setModalOpen(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mark-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courses: selectedCourses }),
        },
      );

      if (!response.ok) {
        message.error("网络错误");
      }
      // if {"status":[{"status":"success","response":{"status":"ok","message":"success"}}]}
      if ((await response.json()).status[0].status === "success") {
        message.success("出勤记录提交成功！");
        localStorage.removeItem("attend_info");
        // await 3 seconds and redirect to home page
        setTimeout(() => {
          router.push("/").then((r) => r);
        }, 3000);
      }
      message.success("出勤记录提交成功！");
      localStorage.removeItem("attend_info");
    } catch {
      setError("提交出勤记录失败");
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);

    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnsType<Course> = [
    {
      title: "课程名称",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "开始时间",
      dataIndex: "start_time",
      key: "start_time",
      render: (text: string) => formatDateTime(text),
    },
    {
      title: "结束时间",
      dataIndex: "end_time",
      key: "end_time",
      render: (text: string) => formatDateTime(text),
    },
    {
      title: "出勤状态",
      key: "present",
      render: (_: any, course: Course) => (
        <Checkbox
          checked={course.present}
          disabled={course.initiallyPresent} // 根据 initiallyPresent 禁用
          onChange={(e) =>
            handleAttendanceChange(course.activity_datetime, e.target.checked)
          }
        />
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">课程出勤表</h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <Table<Course> columns={columns} dataSource={courses} rowKey="id" />
        <Button className="w-full mt-6" htmlType="submit" type="primary">
          提交出勤记录
        </Button>
      </form>

      <Modal
        open={modalOpen}
        title="确认出勤"
        onCancel={() => setModalOpen(false)}
        onOk={handleConfirm}
      >
        <p>已选择的课程：</p>
        {selectedCourses.length > 0 ? (
          selectedCourses.map((course) => (
            <p key={course.activity_datetime} className="mb-2">
              {course.course_name}
            </p>
          ))
        ) : (
          <p>没有选定课程。</p>
        )}
      </Modal>
    </div>
  );
}
