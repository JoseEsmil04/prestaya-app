<template>
  <div class="min-h-screen flex items-center justify-center bg-[#121212] p-4">
    <div class="text-center max-w-md">
      <h1 class="text-2xl font-bold text-white mb-4">Confirma tu correo electrónico</h1>
      <p class="text-gray-300 mb-6">
        Te hemos enviado un correo de confirmación. Por favor revisa tu bandeja de entrada (y la de
        spam).
      </p>
      <RouterLink :to="{ name: 'login' }" class="text-blue-500 hover:underline">
        Ir al inicio de sesión
      </RouterLink>
    </div>
  </div>
</template>
