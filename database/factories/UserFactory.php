<?php

namespace Database\Factories;

use App\Models\Tenant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'telepon' => Str::replace(' ', '', fake()->unique()->phoneNumber()),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(20),
        ];
    }

    public function withTenantAndCategories()
    {
        return $this->afterCreating(function ($user) {
            // Generate start time between 08:00 and 12:00 with only 00 and 30 minutes
            $startHour = fake()->numberBetween(8, 12);
            $startMinute = fake()->randomElement([0, 30]);
            $jamMulai = sprintf('%02d:%02d', $startHour, $startMinute);

            // Generate end time 8-10 hours after start time with only 00 and 30 minutes
            $durationHours = fake()->numberBetween(8, 10);
            $endDateTime = \DateTime::createFromFormat('H:i', $jamMulai);
            $endDateTime->add(new \DateInterval('PT' . $durationHours . 'H'));

            // Ensure end minute is either 00 or 30
            $endMinute = fake()->randomElement([0, 30]);
            $endDateTime->setTime($endDateTime->format('H'), $endMinute);
            $jamSelesai = $endDateTime->format('H:i');

            $nama = $user->nama ? 'Warung ' . explode(' ', $user->nama)[0] : 'Warung ' . fake()->name();

            $tenant = Tenant::create([
                'nama' => $nama,
                'telepon' => $user->telepon,
                'alamat' => fake()->address(),
                'qris' => "qris/1749864998_qris_code.jpeg",
                'jam_buka' => $jamMulai,
                'jam_tutup' => $jamSelesai,
                'tautan' => '/' . str_replace(' ', '-', strtolower($nama)),
                'user_id' => $user->id,
                'status' => 'aktif',
            ]);

            // Buat semua kategori untuk tenant ini
            \Database\Factories\CategoryFactory::createAllCategoriesForTenant($tenant->id);
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
