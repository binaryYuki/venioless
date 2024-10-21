import type { ColumnsType } from "antd/es/table";

import React, { useState, useEffect } from "react";
import { Checkbox, Button, Modal, Table, message } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import axios from "axios";

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
      setError(t("noAttendanceData"));
      // 4s
      setTimeout(() => {
        router.push("/input").then((r) => r);
      }, 4000);
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
        setError(t("attendanceDataError"));
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

  const removePresentedClasses = (courses: Course[]) => {
    return courses.filter((course) => !course.initiallyPresent);
  };

  const handleConfirm = async () => {
    setModalOpen(false);
    const JWT = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token") || "")
      : null;

    if (!JWT) {
      setError(t("unauthorized"));
      // 3s
      setTimeout(() => {
        router.push("/").then((r) => r);
      }, 3000);
    } else {
      axios.defaults.headers.common["Authorization"] = `${JWT.value}`;
    }
    try {
      // 如果 selectedCourses 为空，直接返回
      if (selectedCourses.length === 0) {
        message.error(t("noChosenCourse"));

        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mark-attendance`,
        {
          method: "POST",
          headers: {
            Authorization: `${JWT.value}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courses: selectedCourses }),
        },
      );

      if (!response.ok) {
        message.error(t("networkError"));

        return;
      }

      const responseData = await response.json();

      if (responseData.status && responseData.status.length === 0) {
        message.success(t("successfullySubmitted"));
        localStorage.removeItem("attend_info");
        setTimeout(() => {
          router.push("/").then((r) => r);
        }, 3000);
      } else if (responseData.status[0].status === "success") {
        message.success(t("successfullySubmitted"));
        localStorage.removeItem("attend_info");
        setTimeout(() => {
          router.push("/").then((r) => r);
        }, 3000);
      } else if (responseData.status[0].status === "failed") {
        const errorCode = responseData.status[0].error;

        if (errorCode === 101) {
          setError(t("tokenExpired"));
          // 30s
          setTimeout(() => {
            router.push("/").then((r) => r);
          }, 30000);
        }
        message.error(`${t("recordError")} ${t(`errorCode${errorCode}`)}`);
      }
    } catch {
      setError(t("networkError"));
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

  const filteredCourses = removePresentedClasses(selectedCourses);

  const columns: ColumnsType<Course> = [
    {
      title: t("courseName"),
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: t("startTime"),
      dataIndex: "start_time",
      key: "start_time",
      render: (text: string) => formatDateTime(text),
    },
    {
      title: t("endTime"),
      dataIndex: "end_time",
      key: "end_time",
      render: (text: string) => formatDateTime(text),
    },
    {
      title: t("present"),
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
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("attendanceTable")}
      </h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <Table<Course> columns={columns} dataSource={courses} rowKey="id" />
        <Button className="w-full mt-6" htmlType="submit" type="primary">
          {t("submit")}
        </Button>
      </form>

      <Modal
        open={modalOpen}
        title={t("confirmChoice")}
        onCancel={() => setModalOpen(false)}
        onOk={handleConfirm}
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <p key={course.activity_datetime} className="mb-2">
              {course.course_name} {formatDateTime(course.start_time)} -{" "}
              {formatDateTime(course.end_time)}
            </p>
          ))
        ) : (
          <p>{t("noChosenCourse")}</p>
        )}
      </Modal>
    </div>
  );
}
