async requestCode(phone: string) {
  const isTestPhone = phone === '+7 (777) 777-77-77';
  const loginCode = isTestPhone ? '7777' : this.generateLoginCode();
  const hashedLoginCode = await this.hashLoginCode(loginCode);

  try {
    // First find the user
    const existingUser = await this.prisma.user.findFirst({
      where: {
        phone,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      console.log('User not found for phone:', phone);
      return false;
    }

    // Check if we can send a new code (60 second cooldown)
    if (existingUser.loginCodeIssuedAt) {
      const timeSinceLastCode = Date.now() - existingUser.loginCodeIssuedAt.getTime();
      if (timeSinceLastCode < 60000) {
        console.log('Code requested too soon, wait', 60 - Math.floor(timeSinceLastCode / 1000), 'seconds');
        return false;
      }
    }

    // Update the user with new code
    const user = await this.prisma.user.update({
      data: {
        loginCode: hashedLoginCode,
        loginCodeIssuedAt: new Date(),
      },
      where: {
        id: existingUser.id,
      },
    });

    if (user && !isTestPhone) {
      const smsResponse = await this.sendLoginCode(user.phone, loginCode);
      console.log('smsResponse', smsResponse);
    }

    return true;
  } catch (error) {
    console.log('request code error', error);
    return false;
  }
}