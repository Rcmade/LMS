import { SearchInput } from "@/components/inputs/SearchInputs";
import { CategoryList } from "@/components/list/CategoryList";
import { UserCoursesList } from "@/features/user/course/components/list/CourseList";

const SearchPage = () => {
  return (
    <>
      <div className="block px-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="space-y-4">
        <CategoryList />
        <UserCoursesList />
      </div>
    </>
  );
};

export default SearchPage;
