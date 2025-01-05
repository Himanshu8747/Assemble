import { UserCard } from './UserCard';
import { users } from '../../data/dummyData';

export function FeaturedDevelopers() {
  return (
    <section className="text-2xl font-bold text-gray-900 dark:text-white space-y-6">
      <h2 className="text-2xl font-bold">Featured Developers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
}

