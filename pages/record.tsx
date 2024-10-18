import React, { useState, useEffect, ChangeEvent } from "react";
import { Checkbox, Button, Modal } from "@nextui-org/react";
import { useRouter } from "next/router";

interface Course {
  id: number;
  course_name: string;
  start_time: string;
  end_time: string;
  present: boolean;
}

const CourseAttendanceForm: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const attendInfo = localStorage.getItem("attend_info");

    if (!attendInfo) {
      setError("出勤信息未找到，请输入信息。");
      router.push("/input");
    } else {
      try {
        const parsedData = JSON.parse(attendInfo);
        const savedCourses = parsedData.courses;

        if (Array.isArray(savedCourses)) {
          setCourses(savedCourses);
        } else {
          throw new Error("Courses data is not an array");
        }
      } catch {
        setError("出勤信息格式错误，请检查数据。");
      }
    }
  }, [router]);

  const handleAttendanceChange = (
    id: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id ? { ...course, present: checked } : course
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredCourses = courses.filter((course) => course.present);

    setSelectedCourses(filteredCourses);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    setModalVisible(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mark-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courses: selectedCourses }),
        }
      );

      if (!response.ok) {
        throw new Error("网络错误");
      }

      // TODO: 进一步处理响应
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">课程出勤表</h1>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">课程名称</th>
              <th className="border px-4 py-2">开始时间</th>
              <th className="border px-4 py-2">结束时间</th>
              <th className="border px-4 py-2">出勤状态</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="border px-4 py-2">{course.course_name}</td>
                <td className="border px-4 py-2">
                  {formatDateTime(course.start_time)}
                </td>
                <td className="border px-4 py-2">
                  {formatDateTime(course.end_time)}
                </td>
                <td className="border px-4 py-2">
                  <Checkbox
                    isSelected={course.present}
                    onChange={(e) => handleAttendanceChange(course.id, e)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button className="w-full mt-6" type="submit">
          提交出勤记录
        </Button>
      </form>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">确认出勤</h2>
          <p>已选择的课程：</p>
          {selectedCourses.length > 0 ? (
            selectedCourses.map((course) => (
              <p key={course.id} className="mb-2">
                {course.course_name}
              </p>
            ))
          ) : (
            <p>没有选定课程。</p>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              className="bg-red-500 text-white"
              onClick={() => setModalVisible(false)}
            >
              取消
            </Button>
            <Button className="bg-green-500 text-white" onClick={handleConfirm}>
              确认
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseAttendanceForm;
